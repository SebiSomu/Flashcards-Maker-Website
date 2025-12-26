import React, { useState, useEffect } from 'react';
import type { Folder } from "../../api/flashcards";

interface Flashcard {
    id: number;
    front: string;
    back: string;
    folderId?: number | null;
}

interface QuizModeProps {
    flashcards: Flashcard[];
    folders: Folder[];
    onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ flashcards, folders, onBack }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
    const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Toggle folder selection
    const toggleFolder = (folderId: number) => {
        setSelectedFolderIds(prev =>
            prev.includes(folderId)
                ? prev.filter(id => id !== folderId)
                : [...prev, folderId]
        );
    };

    // Select all folders
    const selectAllFolders = () => {
        setSelectedFolderIds(folders.map(f => f.ID));
    };

    // Clear folder selection
    const clearFolderSelection = () => {
        setSelectedFolderIds([]);
    };

    // Start quiz with selected folders
    const handleStartQuiz = () => {
        let cardsToQuiz = flashcards;

        // If specific folders are selected, filter cards
        if (selectedFolderIds.length > 0) {
            cardsToQuiz = flashcards.filter(card =>
                card.folderId && selectedFolderIds.includes(card.folderId)
            );
        }

        if (cardsToQuiz.length === 0) {
            return; // Don't start if no cards
        }

        // Shuffle the cards
        const shuffled = [...cardsToQuiz].sort(() => Math.random() - 0.5);
        setQuizCards(shuffled);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setQuizStarted(true);
    };

    // Reset effect when flashcards change
    useEffect(() => {
        if (quizStarted && flashcards.length > 0) {
            // Re-filter based on selection if quiz was already started
        }
    }, [flashcards, quizStarted]);

    const handleNextCard = () => {
        if (currentCardIndex < quizCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Get count of cards that would be quizzed
    const getQuizCardCount = () => {
        if (selectedFolderIds.length === 0) {
            return flashcards.length;
        }
        return flashcards.filter(card =>
            card.folderId && selectedFolderIds.includes(card.folderId)
        ).length;
    };

    // Quiz Setup Screen
    if (!quizStarted) {
        return (
            <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in">
                {/* Header */}
                <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Menu
                        </button>
                        <span className="h-6 w-px bg-base-content/10"></span>
                        <span className="font-bold text-base-content uppercase tracking-widest text-sm">Quiz Setup</span>
                    </div>
                </div>

                {/* Setup Content */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="card w-full max-w-xl bg-base-200 shadow-xl border border-base-content/10">
                        <div className="card-body p-8">
                            <h2 className="text-2xl font-black text-base-content mb-2">Configure Your Quiz</h2>
                            <p className="text-base-content/60 mb-6">Select which folders to include in your quiz, or leave all unselected to quiz all cards.</p>

                            {/* Folder Selection */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-base-content/50">Folders</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={selectAllFolders}
                                            className="btn btn-xs btn-ghost text-primary"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={clearFolderSelection}
                                            className="btn btn-xs btn-ghost text-base-content/50"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {folders.length === 0 ? (
                                    <p className="text-base-content/40 text-sm italic">No folders created yet. All cards will be included.</p>
                                ) : (
                                    <div className="grid gap-2">
                                        {folders.map(folder => (
                                            <label
                                                key={folder.ID}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFolderIds.includes(folder.ID)
                                                    ? 'bg-primary/10 border-primary/30'
                                                    : 'bg-base-100 border-base-content/10 hover:border-base-content/20'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary checkbox-sm"
                                                    checked={selectedFolderIds.includes(folder.ID)}
                                                    onChange={() => toggleFolder(folder.ID)}
                                                />
                                                <span className="text-base-content font-medium">{folder.name}</span>
                                                <span className="text-base-content/40 text-xs ml-auto">
                                                    {flashcards.filter(c => c.folderId === folder.ID).length} cards
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Card Count Preview */}
                            <div className="bg-base-100 rounded-xl p-4 border border-base-content/10 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/60">Cards to Quiz:</span>
                                    <span className="text-2xl font-black text-primary">{getQuizCardCount()}</span>
                                </div>
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={handleStartQuiz}
                                disabled={getQuizCardCount() === 0}
                                className="btn btn-primary btn-lg w-full font-bold uppercase tracking-widest disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz In Progress
    if (quizCards.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in">
            {/* Quiz Header */}
            <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30 absolute top-0 left-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Menu
                    </button>
                    <span className="h-6 w-px bg-base-content/10"></span>
                    <span className="font-bold text-base-content uppercase tracking-widest text-sm">Quiz in Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-base-content/50">Card</span>
                    <span className="text-xl font-black text-primary">{currentCardIndex + 1}</span>
                    <span className="text-sm font-medium text-base-content/30">/ {quizCards.length}</span>
                </div>
            </div>

            {/* Quiz Main Area */}
            <div className="flex-1 flex items-center justify-center p-6 pt-24">
                <div className="w-full max-w-3xl perspective-1000">
                    <div
                        onClick={handleFlip}
                        className={`relative w-full aspect-video md:aspect-[2/1] bg-transparent cursor-pointer group perspective-1000 transition-all duration-500`}
                    >
                        {/* Inner Container for Flip Effect */}
                        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

                            {/* FRONT (Question) */}
                            <div className="absolute w-full h-full backface-hidden">
                                <div className="w-full h-full bg-base-200 border border-base-content/10 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden group-hover:border-primary/30 transition-colors">
                                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                    <div className="mb-6">
                                        <span className="badge badge-primary badge-lg uppercase tracking-widest font-bold px-4 py-3">Question</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl text-center font-bold text-base-content leading-tight whitespace-pre-wrap">
                                        {quizCards[currentCardIndex].front}
                                    </h3>
                                    <p className="absolute bottom-8 text-base-content/30 text-xs font-semibold uppercase tracking-widest animate-pulse">Click to Reveal Answer</p>
                                </div>
                            </div>

                            {/* BACK (Answer) */}
                            <div className="absolute w-full h-full backface-hidden rotate-y-180">
                                <div className="w-full h-full bg-base-100 border border-purple-500/20 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center justify-center p-12 relative overflow-hidden">
                                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    <div className="mb-6">
                                        <span className="badge badge-secondary badge-lg uppercase tracking-widest font-bold px-4 py-3">Answer</span>
                                    </div>
                                    <p className="text-xl md:text-2xl text-center font-medium text-base-content/90 leading-relaxed max-w-2xl whitespace-pre-wrap">
                                        {quizCards[currentCardIndex].back}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Footer Controls */}
            <div className="h-24 border-t border-base-content/10 bg-base-200/50 backdrop-blur-md flex items-center justify-center gap-6 z-30">
                <button
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className="btn btn-circle btn-outline border-base-content/20 hover:bg-base-content hover:text-base-100 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-base-content/30 mb-1">Navigation</span>
                    <div className="flex gap-1">
                        {quizCards.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentCardIndex ? 'w-6 bg-primary' : 'w-1.5 bg-base-content/10'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === quizCards.length - 1}
                    className="btn btn-circle btn-primary shadow-lg shadow-primary/30 disabled:opacity-20 disabled:shadow-none disabled:bg-neutral disabled:text-neutral-content disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default QuizMode;

