import React, { useState, useEffect } from 'react';

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

interface QuizModeProps {
    flashcards: Flashcard[];
    onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ flashcards, onBack }) => {
    const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Shuffle cards on mount
        if (flashcards.length > 0) {
            const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
            setQuizCards(shuffled);
            setCurrentCardIndex(0);
            setIsFlipped(false);
        }
    }, [flashcards]);

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

    if (quizCards.length === 0) {
        return null; // Should ideally show a loading or error state if navigated here with 0 cards, but main guard handles it
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
                                    <h3 className="text-2xl md:text-4xl text-center font-bold text-base-content leading-tight">
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
                                    <p className="text-xl md:text-3xl text-center font-medium text-base-content/90 leading-relaxed max-w-2xl">
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
