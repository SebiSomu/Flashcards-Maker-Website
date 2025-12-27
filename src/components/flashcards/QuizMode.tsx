import React, { useState, useEffect, useMemo } from 'react';
import { updateFlashcard } from "../../api/flashcards";
import { type Folder, type Flashcard, type CreateFlashcardDTO } from "../../api/flashcards";
import DifficultyRating from './DifficultyRating';
import SmartReviewCard from './SmartReviewCard';
import { calculateSM2 } from '../../utils/sm2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';

interface QuizModeProps {
    flashcards: Flashcard[];
    folders: Folder[];
    onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ flashcards, folders, onBack }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizType, setQuizType] = useState<'general' | 'due'>('general');
    const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
    const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFirstPass, setIsFirstPass] = useState(true);
    const [repetitionQueue, setRepetitionQueue] = useState<Flashcard[]>([]);
    const [quizComplete, setQuizComplete] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 5000);
        return () => clearInterval(interval);
    }, []);

    const dismissedUntil = parseInt(localStorage.getItem('smartReviewDismissedUntil') || '0');
    // tick is used to force re-render every 5 seconds to update isReviewDismissed
    // eslint-disable-next-line react-hooks/purity
    const isReviewDismissed = (void tick, Date.now() < dismissedUntil);

    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const updateSM2Mutation = useMutation({
        mutationFn: (data: { ID: number, stats: CreateFlashcardDTO }) =>
            updateFlashcard(token || "", data.ID, data.stats),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['flashcards'] });
        }
    });

    const toggleFolder = (folderId: number) => {
        setSelectedFolderIds(prev =>
            prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
        );
    };

    const getAllSubfolderIds = (folderId: number): number[] => {
        const children = folders.filter(f => f.parentId === folderId);
        const childIds = children.map(c => c.ID);
        let allIds = [folderId, ...childIds];
        children.forEach(child => {
            allIds = [...allIds, ...getAllSubfolderIds(child.ID)];
        });
        return [...new Set(allIds)];
    };

    const handleStartQuiz = (type: 'general' | 'due') => {
        let cardsToQuiz: Flashcard[] = [];

        if (type === 'due') {
            const now = new Date();
            cardsToQuiz = flashcards.filter(card =>
                card.nextReviewAt && new Date(card.nextReviewAt) <= now
            );
        } else {
            if (selectedFolderIds.length > 0) {
                let effectiveFolderIds: number[] = [];
                selectedFolderIds.forEach(fid => {
                    effectiveFolderIds = [...effectiveFolderIds, ...getAllSubfolderIds(fid)];
                });
                effectiveFolderIds = [...new Set(effectiveFolderIds)];
                cardsToQuiz = flashcards.filter(card =>
                    card.folderId &&
                    effectiveFolderIds.includes(card.folderId)
                );
            } else {
                cardsToQuiz = flashcards;
            }
        }

        if (cardsToQuiz.length === 0) {
            alert("No scheduled cards found.");
            return;
        }

        setQuizType(type);
        setQuizCards([...cardsToQuiz].sort(() => Math.random() - 0.5));
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setIsFirstPass(true);
        setRepetitionQueue([]);
        setQuizStarted(true);
    };

    const handleRate = (rating: number) => {
        const currentCard = quizCards[currentCardIndex];
        const sm2Result = calculateSM2(
            rating,
            currentCard.interval || 0,
            currentCard.easeFactor || 2.5,
            currentCard.repetitions || 0
        );
        
        console.group(`SM2 Update: Card "${currentCard.front}"`);
        console.log("Rating:", rating);
        console.log("Stats BEFORE:", {
            interval: currentCard.interval || 0,
            easeFactor: currentCard.easeFactor || 2.5,
            repetitions: currentCard.repetitions || 0
        });
        console.log("Stats AFTER:", {
            interval: sm2Result.interval,
            easeFactor: sm2Result.easeFactor,
            repetitions: sm2Result.repetitions,
            nextReview: sm2Result.nextReviewDate.toLocaleDateString() + " " + sm2Result.nextReviewDate.toLocaleTimeString()
        });
        console.groupEnd();

        if (isFirstPass) {
            updateSM2Mutation.mutate({
                ID: currentCard.ID,
                stats: {
                    front: currentCard.front,
                    back: currentCard.back,
                    folderId: currentCard.folderId,
                    nextReviewAt: sm2Result.nextReviewDate.toISOString(),
                    interval: sm2Result.interval,
                    easeFactor: sm2Result.easeFactor,
                    repetitions: sm2Result.repetitions
                }
            });
        }

        let copies = 0;
        if (rating === 3) copies = 1;
        if (rating === 4) copies = 2;
        if (rating === 5) copies = 3;

        const newItems = Array(copies).fill(currentCard);
        const updatedQueue = [...repetitionQueue, ...newItems];

        if (currentCardIndex < quizCards.length - 1) {
            setRepetitionQueue(updatedQueue);
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            if (updatedQueue.length > 0) {
                setQuizCards(updatedQueue.sort(() => Math.random() - 0.5));
                setCurrentCardIndex(0);
                setIsFirstPass(false);
                setIsFlipped(false);
                setRepetitionQueue([]);
            } else {
                setQuizComplete(true);
            }
        }
    };

    const handleNextCard = () => {
        if (currentCardIndex < quizCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
        } else if (!isFirstPass) {
            setQuizComplete(true);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    // Calculate due cards - includes ALL cards that are due after interval (classic SM2 spaced repetition)
    const dueCards = useMemo(() => {
        const now = new Date();
        return flashcards.filter(card =>
            card.nextReviewAt && new Date(card.nextReviewAt) <= now
        );
    }, [flashcards]);

    const dueFolderNames = [...new Set(dueCards.map(c => folders.find(f => f.ID === c.folderId)?.name).filter(Boolean))];

    if (!quizStarted) {
        return (
            <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in text-base-content">
                <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                    <button onClick={onBack} className="btn btn-ghost btn-sm gap-2 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                    <span className="font-bold uppercase tracking-widest text-sm">Quiz Setup</span>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 bg-base-100/30">
                    <div className="card w-full max-w-xl bg-base-200 shadow-xl border border-base-content/10">
                        <div className="card-body p-8">
                            <h2 className="text-2xl font-black mb-6">Choose Your Session</h2>

                            {/* Smart Review Option */}
                            {dueCards.length > 0 && !isReviewDismissed && (
                                <SmartReviewCard
                                    dueCount={dueCards.length}
                                    folderNames={dueFolderNames as string[]}
                                    onStart={() => handleStartQuiz('due')}
                                    onDismiss={() => {
                                        localStorage.setItem('smartReviewDismissedUntil', (Date.now() + 40000).toString());
                                        setTick(t => t + 1);
                                    }}
                                />
                            )}

                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-base-content/30 text-center">Or Start a New Practice Session</span>
                                <p className="text-xs text-center text-base-content/50 px-4 leading-relaxed">
                                    Select folders to practice.<br/>
                                    <strong>Rating System:</strong><br/>
                                    1-2 Stars (0 reps) • 3 Stars (1 rep)<br/>
                                    4 Stars (2 reps) • 5 Stars (3 reps)
                                </p>

                                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 block mb-2">Select Folders (Optional)</span>
                                    {folders.map(folder => (
                                        <label key={folder.ID} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFolderIds.includes(folder.ID) ? 'bg-base-100 border-primary/50 text-primary' : 'bg-base-100/50 border-base-content/10 opacity-70'}`}>
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={selectedFolderIds.includes(folder.ID)} onChange={() => toggleFolder(folder.ID)} />
                                            <span className="font-medium">{folder.name}</span>
                                        </label>
                                    ))}
                                    {folders.length === 0 && <p className="text-base-content/40 text-sm italic">No folders. All cards will be included.</p>}
                                </div>

                                <button
                                    onClick={() => handleStartQuiz('general')}
                                    className="btn btn-outline w-full font-bold uppercase tracking-widest border-base-content/20 hover:border-primary hover:bg-primary/5"
                                >
                                    Start General Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes pulse-subtle {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.01); }
                    }
                    .animate-pulse-subtle {
                        animation: pulse-subtle 2s ease-in-out infinite;
                    }
                `}} />
            </div>
        );
    }

    if (quizComplete) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-base-100 animate-fade-in text-base-content w-full h-full">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translate3d(0, 5px, 0); } to { opacity: 1; transform: scale(1) translate3d(0, 0, 0); } }
                `}} />
                <div className="card w-full max-w-sm bg-base-200 shadow-2xl border border-base-content/10 p-8 text-center [animation:scaleIn_0.3s_ease-out_forwards]">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h2 className="text-3xl font-black mb-2">{quizType === 'due' ? 'Review Complete!' : 'Quiz Complete!'}</h2>
                    <p className="text-base-content/60 text-sm mb-8">You've successfully finished this session.</p>
                    <button onClick={onBack} className="btn btn-primary w-full font-bold uppercase tracking-widest">Done</button>
                    <button
                        onClick={() => { setQuizComplete(false); setQuizStarted(false); }}
                        className="btn btn-ghost btn-sm w-full mt-4 text-xs font-bold uppercase tracking-widest text-base-content/40"
                    >
                        New Session
                    </button>
                </div>
            </div>
        );
    }

    if (quizCards.length === 0) return null;

    return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in bg-base-100 text-base-content">
            <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="btn btn-ghost btn-sm font-bold opacity-40 hover:opacity-100">Exit</button>
                    <span className="h-6 w-px bg-base-content/10"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/60">
                        {quizType === 'due' ? 'Smart Review Mode' : 'Practice Mode'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-primary">{currentCardIndex + 1}</span>
                    <span className="text-xs font-bold text-base-content/20">/ {quizCards.length}</span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 pt-24">
                <div className="w-full max-w-3xl [perspective:1000px]">
                    <div onClick={() => setIsFlipped(!isFlipped)} className="relative w-full aspect-video md:aspect-[2/1] cursor-pointer group">
                        <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                            <div className="absolute w-full h-full [backface-visibility:hidden] bg-base-200 border-2 border-base-content/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center group-hover:border-primary/20 transition-colors">
                                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 to-primary"></div>
                                <span className="badge badge-outline border-base-content/10 text-[10px] font-black uppercase tracking-widest mb-6 opacity-40">Front</span>
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight whitespace-pre-wrap">{quizCards[currentCardIndex].front}</h3>
                                <p className="absolute bottom-8 text-xs font-bold opacity-20 uppercase tracking-[0.2em] animate-pulse">Tap to Reveal</p>
                            </div>
                            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-base-100 border-2 border-primary/20 rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500"></div>
                                <span className="badge badge-outline border-primary/10 text-[10px] font-black uppercase tracking-widest mb-6 text-primary/50">Back</span>
                                <p className="text-xl md:text-2xl font-bold mb-10 leading-relaxed text-base-content/90 whitespace-pre-wrap">{quizCards[currentCardIndex].back}</p>

                                {isFirstPass ? (
                                    <DifficultyRating onRate={handleRate} />
                                ) : (
                                    <div className="flex flex-col items-center animate-fade-in-up">
                                        <button onClick={(e) => { e.stopPropagation(); handleNextCard(); }} className="btn btn-primary btn-lg px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/30">Got it!</button>
                                        <button onClick={(e) => { e.stopPropagation(); setQuizComplete(true); }} className="btn btn-ghost btn-xs mt-6 opacity-20 hover:opacity-100 hover:text-error uppercase tracking-widest font-black">End Session</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-24 border-t border-base-content/10 bg-base-200/50 flex items-center justify-center gap-6">
                <button onClick={handlePrevCard} disabled={currentCardIndex === 0} className="btn btn-circle btn-outline btn-sm opacity-40 hover:opacity-100 disabled:opacity-5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex gap-1">
                    {quizCards.map((_, idx) => (
                        <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentCardIndex ? 'w-4 bg-primary' : 'w-1 bg-base-content/10'}`}></div>
                    ))}
                </div>
                <button onClick={handleNextCard} disabled={currentCardIndex === quizCards.length - 1} className="btn btn-circle btn-primary btn-sm shadow-lg shadow-primary/20 disabled:opacity-5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default QuizMode;
