import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateFlashcard } from "../../api/flashcards";
import { type Folder, type Flashcard, type CreateFlashcardDTO } from "../../api/flashcards";
import SmartReviewCard from './SmartReviewCard';
import QuizCard from './QuizCard';
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
    const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 5000);
        return () => clearInterval(interval);
    }, []);

    const dismissedUntil = parseInt(localStorage.getItem('smartReviewDismissedUntil') || '0');
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

        setIsFlipped(false);
        setDirection(1);

        setTimeout(() => {
            if (currentCardIndex < quizCards.length - 1) {
                setRepetitionQueue(updatedQueue);
                setCurrentCardIndex(prev => prev + 1);
            } else {
                if (updatedQueue.length > 0) {
                    setQuizCards(updatedQueue.sort(() => Math.random() - 0.5));
                    setCurrentCardIndex(0);
                    setIsFirstPass(false);
                    setRepetitionQueue([]);
                } else {
                    setQuizComplete(true);
                }
            }
        }, 150);
    };

    const handleNextCard = () => {
        setDirection(1);
        setIsFlipped(false);

        setTimeout(() => {
            if (currentCardIndex < quizCards.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
            } else if (!isFirstPass) {
                setQuizComplete(true);
            }
        }, 150);
    };

    const handlePrevCard = () => {
        setDirection(-1);
        setIsFlipped(false);

        setTimeout(() => {
            if (currentCardIndex > 0) {
                setCurrentCardIndex(prev => prev - 1);
            }
        }, 150);
    };

    const dueCards = useMemo(() => {
        const now = new Date();
        return flashcards.filter(card =>
            card.nextReviewAt &&
            new Date(card.nextReviewAt) <= now &&
            (card.repetitions || 0) > 0
        );
    }, [flashcards]);

    const dueFolderNames = [...new Set(dueCards.map(c => folders.find(f => f.ID === c.folderId)?.name).filter(Boolean))];

    if (!quizStarted) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col w-full h-full relative z-10 text-base-content"
            >
                <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                    <button onClick={onBack} className="btn btn-ghost btn-sm gap-2 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                    <span className="font-bold uppercase tracking-widest text-sm">Quiz Setup</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex items-center justify-center p-6 bg-base-100/30"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="card w-full max-w-xl bg-base-200 shadow-xl border border-base-content/10"
                    >
                        <div className="card-body p-8">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-black mb-6"
                            >
                                Choose Your Session
                            </motion.h2>

                            {dueCards.length > 0 && !isReviewDismissed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <SmartReviewCard
                                        dueCount={dueCards.length}
                                        folderNames={dueFolderNames as string[]}
                                        onStart={() => handleStartQuiz('due')}
                                        onDismiss={() => {
                                            localStorage.setItem('smartReviewDismissedUntil', (Date.now() + 40000).toString());
                                            setTick(t => t + 1);
                                        }}
                                    />
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col gap-4"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest text-base-content/30 text-center">Or Start a New Practice Session</span>
                                <p className="text-xs text-center text-base-content/50 px-4 leading-relaxed">
                                    Select folders to practice.<br/>
                                    <strong>Rating System:</strong><br/>
                                    1-2 Stars (0 reps) • 3 Stars (1 rep)<br/>
                                    4 Stars (2 reps) • 5 Stars (3 reps)
                                </p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 block mb-2">Select Folders (Optional)</span>
                                    {folders.map(folder => (
                                        <label key={folder.ID} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFolderIds.includes(folder.ID) ? 'bg-base-100 border-primary/50 text-primary' : 'bg-base-100/50 border-base-content/10 opacity-70'}`}>
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={selectedFolderIds.includes(folder.ID)} onChange={() => toggleFolder(folder.ID)} />
                                            <span className="font-medium">{folder.name}</span>
                                        </label>
                                    ))}
                                    {folders.length === 0 && <p className="text-base-content/40 text-sm italic">No folders. All cards will be included.</p>}
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => handleStartQuiz('general')}
                                    className="btn btn-outline w-full font-bold uppercase tracking-widest border-base-content/20 hover:border-primary hover:bg-primary/5"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start General Quiz
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    if (quizComplete) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 bg-base-100 text-base-content w-full h-full"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="card w-full max-w-sm bg-base-200 shadow-2xl border border-base-content/10 p-8 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <span className="text-4xl">🎉</span>
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-black mb-2"
                    >
                        {quizType === 'due' ? 'Review Complete!' : 'Quiz Complete!'}
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-base-content/60 text-sm mb-8"
                    >
                        You've successfully finished this session.
                    </motion.p>
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={onBack}
                        className="btn btn-primary w-full font-bold uppercase tracking-widest"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Done
                    </motion.button>
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { setQuizComplete(false); setQuizStarted(false); }}
                        className="btn btn-ghost btn-sm w-full mt-4 text-xs font-bold uppercase tracking-widest text-base-content/40"
                    >
                        New Session
                    </motion.button>
                </motion.div>
            </motion.div>
        );
    }

    if (quizCards.length === 0) return null;

    const cardAnimation = {
        initial: (dir: number) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95,
            rotateY: dir > 0 ? 10 : -10,
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25,
                mass: 0.8
            }
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            rotateY: dir > 0 ? -10 : 10,
            transition: {
                duration: 0.2,
                ease: "easeInOut" as const
            }
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col w-full h-full relative z-10 bg-base-100 text-base-content"
        >
            {/* Animated gradient background */}
            <motion.div
                animate={{
                    background: [
                        'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(37, 99, 235, 0.05) 100%)',
                        'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(168, 85, 247, 0.05) 100%)',
                        'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(37, 99, 235, 0.05) 100%)'
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[size:200%_200%] opacity-30 pointer-events-none z-0"
            />

            <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="btn btn-ghost btn-sm font-bold opacity-40 hover:opacity-100">
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

            <div className="flex-1 flex items-center justify-center p-6">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentCardIndex}
                        custom={direction}
                        variants={cardAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-w-3xl"
                    >
                        <QuizCard
                            card={quizCards[currentCardIndex]}
                            folderName={quizCards[currentCardIndex].folderId ? folders.find(f => f.ID === quizCards[currentCardIndex].folderId)?.name : undefined}
                            isFlipped={isFlipped}
                            onFlip={() => setIsFlipped(!isFlipped)}
                            isFirstPass={isFirstPass}
                            onRate={handleRate}
                            onNextCard={handleNextCard}
                            onEndSession={() => setQuizComplete(true)}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-24 border-t border-base-content/10 bg-base-200/50 flex items-center justify-center gap-6"
            >
                <motion.button
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className="btn btn-circle btn-outline btn-sm opacity-40 hover:opacity-100 disabled:opacity-5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>

                <div className="flex gap-1">
                    {quizCards.map((_, idx) => (
                        <motion.div
                            key={idx}
                            className={`h-1 rounded-full ${idx === currentCardIndex ? 'w-8 bg-primary' : 'w-1 bg-base-content/10'}`}
                            initial={{ width: idx === currentCardIndex ? '8px' : '4px' }}
                            animate={{
                                width: idx === currentCardIndex ? '32px' : '4px',
                                backgroundColor: idx === currentCardIndex
                                    ? 'rgb(37 99 235)'
                                    : idx < currentCardIndex
                                        ? 'rgb(37 99 235 / 0.4)'
                                        : 'rgb(0 0 0 / 0.1)'
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    ))}
                </div>

                <motion.button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === quizCards.length - 1}
                    className="btn btn-circle btn-primary btn-sm shadow-lg shadow-primary/20 disabled:opacity-5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default QuizMode;