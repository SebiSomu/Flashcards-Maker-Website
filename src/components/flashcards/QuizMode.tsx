import React, { useState, useEffect, useMemo } from 'react';
import { updateFlashcard, dismissSmartReview, fetchCurrentUser } from "../../api/flashcards";
import { type Folder, type Flashcard, type CreateFlashcardDTO } from "../../api/flashcards";
import SmartReviewCard from './SmartReviewCard';
import QuizCard from './QuizCard';
import QuizCompletedCard from './QuizCompletedCard';
import QuizNavigationBar from './QuizNavigationBar';
import { calculateSM2 } from '../../utils/sm2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [completedInSession, setCompletedInSession] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 5000);
        return () => clearInterval(interval);
    }, []);

    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const { data: currentUser } = useQuery({
        queryKey: ['me'],
        queryFn: () => fetchCurrentUser(token || ""),
        enabled: !!token,
        refetchInterval: 30000
    });

    const isReviewDismissed = useMemo(() => {
        if (!currentUser?.smartReviewDismissedUntil) return false;
        return new Date(currentUser.smartReviewDismissedUntil) > new Date();
    }, [currentUser, tick]);

    const dismissMutation = useMutation({
        mutationFn: (hours: number) => dismissSmartReview(token || "", hours),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
        }
    });

    const updateSM2Mutation = useMutation({
        mutationFn: (data: { ID: number, stats: CreateFlashcardDTO }) =>
            updateFlashcard(token || "", data.ID, data.stats),
        onSuccess: (_data, variables) => {
            console.log("SM2 Updated successfully for card", variables.ID);
            return queryClient.invalidateQueries({ queryKey: ['flashcards'] });
        },
        onError: (error) => {
            console.error("Failed to update SM2:", error);
            alert("Failed to save progress for card. Please check connection.");
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
                card.nextReviewAt &&
                new Date(card.nextReviewAt) <= now &&
                (card.repetitions || 0) > 0
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

        if (isFirstPass) {
            setCompletedInSession(prev => [...prev, currentCard.ID]);
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

        setIsTransitioning(true);

        setTimeout(() => {
            if (currentCardIndex < quizCards.length - 1) {
                setRepetitionQueue(updatedQueue);
                setCurrentCardIndex(prev => prev + 1);
                setIsFlipped(false);
            } else {
                if (updatedQueue.length > 0) {
                    setQuizCards(updatedQueue.sort(() => Math.random() - 0.5));
                    setCurrentCardIndex(0);
                    setIsFirstPass(false);
                    setRepetitionQueue([]);
                    setIsFlipped(false);
                } else {
                    setQuizComplete(true);
                }
            }
            setTimeout(() => setIsTransitioning(false), 10);
        }, 150);
    };

    const handleNextCard = () => {
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentCardIndex < quizCards.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
                setIsFlipped(false);
            } else if (!isFirstPass) {
                setQuizComplete(true);
            }
            setTimeout(() => setIsTransitioning(false), 10);
        }, 150);
    };

    const handlePrevCard = () => {
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentCardIndex > 0) {
                setCurrentCardIndex(prev => prev - 1);
                setIsFlipped(false);
            }
            setTimeout(() => setIsTransitioning(false), 10);
        }, 150);
    };

    const dueCards = useMemo(() => {
        const now = new Date();
        return flashcards.filter(card =>
            card.nextReviewAt &&
            new Date(card.nextReviewAt) <= now &&
            (card.repetitions || 0) > 0 &&
            !completedInSession.includes(card.ID)
        );
    }, [flashcards, completedInSession]);

    const dueFolderNames = [...new Set(dueCards.map(c => folders.find(f => f.ID === c.folderId)?.name).filter(Boolean))];

    if (!quizStarted) {
        return (
            <div className="flex-1 flex flex-col w-full h-full relative z-10 text-base-content">
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

                            {dueCards.length > 0 && !isReviewDismissed && (
                                <SmartReviewCard
                                    dueCount={dueCards.length}
                                    folderNames={dueFolderNames as string[]}
                                    onStart={() => handleStartQuiz('due')}
                                    onDismiss={() => {
                                        dismissMutation.mutate(24);
                                    }}
                                />
                            )}

                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-base-content/30 text-center">
                                    Or Start a New Practice Session
                                </span>
                                <p className="text-xs text-center text-base-content/50 px-4 leading-relaxed">
                                    Select folders to practice.<br />
                                    <strong>Rating System:</strong><br />
                                    1-2 Stars (0 reps) • 3 Stars (1 rep)<br />
                                    4 Stars (2 reps) • 5 Stars (3 reps)
                                </p>

                                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 block mb-2">
                                        Select Folders (Optional)
                                    </span>
                                    {folders.map(folder => (
                                        <label
                                            key={folder.ID}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFolderIds.includes(folder.ID)
                                                ? 'bg-base-100 border-primary/50 text-primary'
                                                : 'bg-base-100/50 border-base-content/10 opacity-70'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-sm"
                                                checked={selectedFolderIds.includes(folder.ID)}
                                                onChange={() => toggleFolder(folder.ID)}
                                            />
                                            <span className="font-medium">{folder.name}</span>
                                        </label>
                                    ))}
                                    {folders.length === 0 && (
                                        <p className="text-base-content/40 text-sm italic">
                                            No folders. All cards will be included.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleStartQuiz('general')}
                                    className="btn btn-outline w-full font-bold uppercase tracking-widest border-base-content/20 hover:border-primary hover:bg-primary/5 transition-colors"
                                >
                                    Start General Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (quizComplete) {
        return (
            <QuizCompletedCard
                quizType={quizType}
                onBack={onBack}
                onNewSession={() => {
                    setQuizComplete(false);
                    setQuizStarted(false);
                }}
            />
        );
    }

    if (quizCards.length === 0) return null;

    return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 bg-base-100 text-base-content overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-[rgba(37,99,235,0.1)] to-[rgba(168,85,247,0.1)] opacity-20" />
            <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="btn btn-ghost btn-sm font-bold opacity-40 hover:opacity-100 transition-opacity">
                        Exit
                    </button>
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

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl relative">
                    <div
                        key={currentCardIndex}
                        className={`transition-all duration-150 ${isTransitioning
                            ? 'opacity-0 transform translate-y-2'
                            : 'opacity-100 transform translate-y-0'
                            }`}
                        style={{
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionProperty: 'opacity, transform',
                            willChange: 'opacity, transform'
                        }}
                    >
                        <QuizCard
                            card={quizCards[currentCardIndex]}
                            folderName={
                                quizCards[currentCardIndex].folderId
                                    ? folders.find(f => f.ID === quizCards[currentCardIndex].folderId)?.name
                                    : undefined
                            }
                            isFlipped={isFlipped}
                            onFlip={() => setIsFlipped(!isFlipped)}
                            isFirstPass={isFirstPass}
                            onRate={handleRate}
                            onNextCard={handleNextCard}
                            onEndSession={() => setQuizComplete(true)}
                        />
                    </div>
                </div>
            </div>

            <QuizNavigationBar
                currentCardIndex={currentCardIndex}
                totalCards={quizCards.length}
                onPrevCard={handlePrevCard}
                onNextCard={handleNextCard}
                quizType={quizType}
                isFirstPass={isFirstPass}
            />
        </div>
    );
};

export default QuizMode;