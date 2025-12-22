import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainNavBar from "../components/MainNavBar";
import Footer from "../components/Footer";
import SelectionScreen from "../components/flashcards/SelectionScreen";
import CreateMode from "../components/flashcards/CreateMode";
import EditMode from "../components/flashcards/EditMode";
import QuizMode from "../components/flashcards/QuizMode";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";
import { fetchFlashcards, createFlashcard, updateFlashcard, deleteFlashcard, type CreateFlashcardDTO, type Flashcard } from "../api/flashcards";

interface BackendFlashcard {
    ID: number;
    front: string;
    back: string;
}

const CreateFlashcards = () => {
    // Mode state: 'selection' | 'create' | 'edit' | 'quiz'
    const [mode, setMode] = useState<'selection' | 'create' | 'edit' | 'quiz'>('selection');

    // Auth Token
    const token = useAuthStore((state) => state.token);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Query: Fetch Flashcards
    const { data: flashcards = [], isLoading } = useQuery({
        queryKey: ['flashcards'],
        queryFn: () => fetchFlashcards(token || ""),
        enabled: !!token, // Only fetch if token exists
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (newCard: CreateFlashcardDTO) => createFlashcard(token || "", newCard),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
            showToast("Card Created Successfully!", 'success');
        },
        onError: () => {
            showToast("Failed to create card.", 'error');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (card: Flashcard) => updateFlashcard(token || "", card.ID, { front: card.front, back: card.back }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
            showToast("Card Updated Successfully!", 'success');
        },
        onError: () => {
            showToast("Failed to update card.", 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteFlashcard(token || "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
            showToast("Card Deleted Successfully!", 'info');
        },
        onError: () => {
            showToast("Failed to delete card.", 'error');
        }
    });

    // --- Mode Transitions ---

    const handleEnterCreateMode = () => setMode('create');
    const handleEnterEditMode = () => setMode('edit');
    const handleStartQuiz = () => {
        if (flashcards.length > 0) setMode('quiz');
    };
    const handleBackToSelection = () => setMode('selection');

    // --- Data Actions ---

    const handleCreateCard = (newCardData: { front: string; back: string }) => {
        createMutation.mutate(newCardData);
    };

    const handleUpdateCard = (updatedCard: { id: number; front: string; back: string }) => {
        updateMutation.mutate({ ...updatedCard, ID: updatedCard.id, userId: 0 } as Flashcard);
    };

    const handleDeleteCard = (id: number) => {
        deleteMutation.mutate(id);
    };

    const adaptedFlashcards = flashcards.map((card: BackendFlashcard) => ({
        id: card.ID,
        front: card.front,
        back: card.back
    }));

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <MainNavBar />

            <div className="flex flex-1 pt-24 h-[calc(100vh-theme(spacing.24))] relative">
                {/* Visual gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none z-0"></div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 z-50">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {/* --- RENDER MODES --- */}

                {mode === 'selection' && (
                    <SelectionScreen
                        onSelectCreate={handleEnterCreateMode}
                        onSelectEdit={handleEnterEditMode}
                        onSelectQuiz={handleStartQuiz}
                        flashcardCount={adaptedFlashcards.length}
                    />
                )}

                {mode === 'create' && (
                    <CreateMode
                        flashcards={adaptedFlashcards}
                        onCreate={handleCreateCard}
                        onBack={handleBackToSelection}
                    />
                )}

                {mode === 'edit' && (
                    <EditMode
                        flashcards={adaptedFlashcards}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        onBack={handleBackToSelection}
                    />
                )}

                {mode === 'quiz' && (
                    <QuizMode
                        flashcards={adaptedFlashcards}
                        onBack={handleBackToSelection}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CreateFlashcards;
