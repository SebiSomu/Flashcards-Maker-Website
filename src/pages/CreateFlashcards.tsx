import { useState } from "react";
import MainNavBar from "../components/MainNavBar";
import Footer from "../components/Footer";
import SelectionScreen from "../components/flashcards/SelectionScreen";
import CreateMode from "../components/flashcards/CreateMode";
import EditMode from "../components/flashcards/EditMode";
import QuizMode from "../components/flashcards/QuizMode";

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

    // --- Mode Transitions ---

    const handleEnterCreateMode = () => setMode('create');
    const handleEnterEditMode = () => setMode('edit');
    const handleStartQuiz = () => {
        if (flashcards.length > 0) setMode('quiz');
    };
    const handleBackToSelection = () => setMode('selection');

    // --- Data Actions ---

    const handleCreateCard = (newCard: Flashcard) => {
        setFlashcards([newCard, ...flashcards]);
    };

    const handleUpdateCard = (updatedCard: Flashcard) => {
        setFlashcards(flashcards.map(card =>
            card.id === updatedCard.id ? updatedCard : card
        ));
    };

    const handleDeleteCard = (id: string) => {
        setFlashcards(flashcards.filter(card => card.id !== id));
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <MainNavBar />

            <div className="flex flex-1 pt-24 h-[calc(100vh-theme(spacing.24))] relative">
                {/* Visual gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none z-0"></div>

                {/* --- RENDER MODES --- */}

                {mode === 'selection' && (
                    <SelectionScreen
                        onSelectCreate={handleEnterCreateMode}
                        onSelectEdit={handleEnterEditMode}
                        onSelectQuiz={handleStartQuiz}
                        flashcardCount={flashcards.length}
                    />
                )}

                {mode === 'create' && (
                    <CreateMode
                        flashcards={flashcards}
                        onCreate={handleCreateCard}
                        onBack={handleBackToSelection}
                    />
                )}

                {mode === 'edit' && (
                    <EditMode
                        flashcards={flashcards}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        onBack={handleBackToSelection}
                    />
                )}

                {mode === 'quiz' && (
                    <QuizMode
                        flashcards={flashcards}
                        onBack={handleBackToSelection}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CreateFlashcards;
