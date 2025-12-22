import { useState } from "react";
import MainNavBar from "../components/MainNavBar";
import Footer from "../components/Footer";

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

const CreateFlashcards = () => {
    // Mode state: 'selection' | 'create' | 'edit' | 'quiz'
    const [mode, setMode] = useState<'selection' | 'create' | 'edit' | 'quiz'>('selection');

    // Shared state (Flashcards data)
    const [flashcards, setFlashcards] = useState<Flashcard[]>([
        { id: '1', front: 'What is React?', back: 'A JavaScript library for building user interfaces.' },
    ]);

    // Form State
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    // Quiz Mode State
    const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // --- Mode Transitions ---

    const handleEnterCreateMode = () => {
        handleClearForm();
        setMode('create');
    };

    const handleEnterEditMode = () => {
        handleClearForm();
        setMode('edit');
    };

    const handleStartQuiz = () => {
        if (flashcards.length === 0) return;
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setQuizCards(shuffled);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setMode('quiz');
    };

    const handleExitToSelection = () => {
        setMode('selection');
        handleClearForm();
    };

    // --- Form Actions ---

    const handleClearForm = () => {
        setFront("");
        setBack("");
        setSelectedCardId(null);
    };

    const handleCardClick = (card: Flashcard) => {
        if (mode === 'create') return; // Cannot select cards in create mode
        setFront(card.front);
        setBack(card.back);
        setSelectedCardId(card.id);
    };

    const handleSave = () => {
        if (!front.trim() || !back.trim()) return;

        if (mode === 'edit' && selectedCardId) {
            // Edit existing
            setFlashcards(flashcards.map(card =>
                card.id === selectedCardId ? { ...card, front, back } : card
            ));
        } else {
            // Create new (applies to 'create' mode mainly)
            const newCard: Flashcard = {
                id: Date.now().toString(),
                front,
                back
            };
            setFlashcards([newCard, ...flashcards]);
            // Clear form to allow immediate next entry
            setFront("");
            setBack("");
            setSelectedCardId(null);
        }
    };

    const handleDelete = () => {
        if (!selectedCardId) return;
        setFlashcards(flashcards.filter(card => card.id !== selectedCardId));
        handleClearForm();
    };

    // --- Quiz Actions ---

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

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <MainNavBar />

            <div className="flex flex-1 pt-24 h-[calc(100vh-theme(spacing.24))] relative">
                {/* Visual gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none z-0"></div>

                {/* --- SELECTION MODE --- */}
                {mode === 'selection' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h1 className="text-2xl md:text-5xl font-black text-base-content mb-4 tracking-tight">
                                Flashcards Maker
                            </h1>
                            <p className="text-md text-base-content/60 max-w-lg mx-auto">
                                Manage your knowledge or test your skills. Choose a mode to get started.
                            </p>
                            <p className="text-xs font-bold bg-base-200 inline-block px-3 py-0.5 rounded-full mt-3 text-base-content/50 uppercase tracking-widest border border-base-content/5">
                                Your Collection: {flashcards.length} Cards
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                            {/* Create Card */}
                            <div
                                onClick={handleEnterCreateMode}
                                className="group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden text-left"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-emerald-500 transition-colors">Create</h2>
                                <p className="text-base-content/60">Add new flashcards to your collection quickly and efficiently.</p>
                            </div>

                            {/* Edit Card */}
                            <div
                                onClick={handleEnterEditMode}
                                className="group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden text-left"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-blue-500 transition-colors">Edit</h2>
                                <p className="text-base-content/60">Modify, delete or review your existing flashcards.</p>
                            </div>

                            {/* Quiz Card */}
                            <div
                                onClick={handleStartQuiz}
                                className={`group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer overflow-hidden text-left ${flashcards.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-purple-500 transition-colors">Quiz</h2>
                                <p className="text-base-content/60">Test your knowledge with a randomized quiz.</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- CREATE & EDIT MODES (Shared Layout) --- */}
                {(mode === 'create' || mode === 'edit') && (
                    <div className="flex flex-1 w-full h-full relative z-10 overflow-hidden">
                        {/* Sidebar - Created Cards */}
                        <div className="w-80 bg-base-200 border-r border-base-content/10 p-6 flex flex-col h-full overflow-hidden shrink-0 z-20">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col gap-4 w-full">
                                    <button
                                        onClick={handleExitToSelection}
                                        className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content self-start pl-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Back to Menu
                                    </button>
                                    <h2 className="text-base-content font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        Your Cards
                                        <span className="text-base-content/50 text-xs ml-1">({flashcards.length})</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {flashcards.length === 0 && (
                                    <p className="text-base-content/40 text-xs text-center mt-10 italic">No cards yet. Create one!</p>
                                )}
                                {flashcards.map((card) => (
                                    <div
                                        key={card.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCardClick(card);
                                        }}
                                        className={`group relative bg-base-100 p-4 rounded-xl border transition-all ${mode === 'edit' ? 'cursor-pointer' : 'cursor-default'} ${selectedCardId === card.id
                                            ? "border-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                            : "border-base-content/5"
                                            } ${mode === 'edit' && selectedCardId !== card.id ? "hover:border-base-content/10" : ""}`}
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-xl transition-opacity ${selectedCardId === card.id ? "opacity-100" : "opacity-0"
                                            }`}></div>
                                        <h3 className="text-base-content font-bold text-sm truncate mb-1 pointer-events-none">{card.front}</h3>
                                        <p className="text-base-content/70 text-xs truncate pointer-events-none">{card.back}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content - Creation/Edit Area */}
                        <div className="flex-1 flex flex-col bg-base-100/50 p-6 md:p-10">
                            <div className="flex-1 flex items-center justify-center">
                                {/* Static Card */}
                                <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-content/10">
                                    {/* Edit Mode Empty State */}
                                    {mode === 'edit' && !selectedCardId ? (
                                        <div className="card-body p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                            <div className="w-20 h-20 bg-base-100 rounded-full flex items-center justify-center mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-base-content mb-2">Select a Flashcard</h3>
                                            <p className="text-base-content/60 max-w-xs">Choose a card from the sidebar to edit its content or delete it.</p>
                                        </div>
                                    ) : (
                                        /* Form (Create Mode OR Edit Mode with Selection) */
                                        <div className="card-body p-8 md:p-12 animate-fade-in">
                                            <div className="flex justify-between items-center border-b border-base-content/10 pb-4 mb-8">
                                                <h2 className="text-2xl text-base-content font-black">
                                                    {mode === 'edit' ? "Edit Flashcard" : "Create New Flashcard"}
                                                </h2>
                                                <div className={`badge badge-outline text-xs font-bold uppercase tracking-widest p-3 ${mode === 'edit' ? 'badge-primary' : 'badge-accent'}`}>
                                                    {mode === 'edit' ? 'Editing Mode' : 'Creation Mode'}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="form-control w-full">
                                                    <label className="label">
                                                        <span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Front Side (Question)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input input-bordered w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none h-14"
                                                        value={front}
                                                        onChange={(e) => setFront(e.target.value)}
                                                        placeholder="e.g. What is React?"
                                                    />
                                                </div>

                                                <div className="form-control w-full">
                                                    <label className="label">
                                                        <span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Back Side (Answer)</span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered h-32 w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-base leading-relaxed"
                                                        value={back}
                                                        onChange={(e) => setBack(e.target.value)}
                                                        placeholder="e.g. A JavaScript library..."
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="card-actions justify-between mt-8">
                                                <div>
                                                    {mode === 'edit' && selectedCardId && (
                                                        <button
                                                            className="btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border-none mr-2"
                                                            onClick={handleDelete}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn bg-transparent border-base-content/20 text-base-content hover:bg-base-content/10"
                                                        onClick={handleClearForm}
                                                    >
                                                        {mode === 'edit' ? "Cancel" : "Clear"}
                                                    </button>
                                                    <button
                                                        className="btn bg-primary hover:bg-primary/90 text-primary-content border-none px-8"
                                                        onClick={handleSave}
                                                    >
                                                        {mode === 'edit' ? "Save Changes" : "Create Card"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- QUIZ MODE --- */}
                {mode === 'quiz' && quizCards.length > 0 && (
                    <div className="flex-1 flex flex-col w-full h-full relative z-10 animate-fade-in">
                        {/* Quiz Header */}
                        <div className="w-full h-20 border-b border-base-content/10 flex items-center justify-between px-8 bg-base-100/80 backdrop-blur-sm z-30 absolute top-0 left-0">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleExitToSelection}
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
                )}
            </div>
            <Footer />
        </div>
    );
};
export default CreateFlashcards;
