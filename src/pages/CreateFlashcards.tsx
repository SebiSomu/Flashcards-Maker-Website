import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainNavBar from "../components/MainNavBar";
import Footer from "../components/Footer";
import SelectionScreen from "../components/flashcards/SelectionScreen";
import CreateMode from "../components/flashcards/CreateMode";
import EditMode from "../components/flashcards/EditMode";
import QuizMode from "../components/flashcards/QuizMode";
import { useAuthStore } from "../store/useAuthStore";
import { useToast } from "../hooks/useToast";
import {
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    fetchFolders,
    createFolder,
    deleteFolder
} from "../api/flashcards";
import type { CreateFlashcardDTO, Flashcard, Folder } from "../api/flashcards";

const CreateFlashcards = () => {
    // Mode state: 'selection' | 'create' | 'edit' | 'quiz'
    const [mode, setMode] = useState<'selection' | 'create' | 'edit' | 'quiz'>('selection');

    // Timer for auto-refreshing due cards
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 5000);
        return () => clearInterval(interval);
    }, []);

    const dismissedUntil = parseInt(localStorage.getItem('smartReviewDismissedUntil') || '0');
    // tick is used to force re-render every 5 seconds to update isReviewDismissed
    // eslint-disable-next-line react-hooks/purity
    const isReviewDismissed = (void tick, Date.now() < dismissedUntil);

    // Auth Token
    const token = useAuthStore((state) => state.token);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Queries
    const { data: flashcards = [], isLoading: isLoadingCards } = useQuery({
        queryKey: ['flashcards'],
        queryFn: () => fetchFlashcards(token || ""),
        enabled: !!token,
    });

    const { data: folders = [] } = useQuery<Folder[]>({
        queryKey: ['folders'],
        queryFn: () => fetchFolders(token || ""),
        enabled: !!token,
    });

    // Calculate due count - ALL cards that are due after interval (matches review logic)
    const dueCount = useMemo(() => {
        if (isReviewDismissed) return 0;
        const now = new Date();
        return flashcards.filter((card: Flashcard) => 
            card.nextReviewAt && new Date(card.nextReviewAt) <= now
        ).length;
    }, [flashcards, isReviewDismissed]);

    // Mutations - Folders
    const createFolderMutation = useMutation({
        mutationFn: (variables: { name: string; parentId?: number | null }) => createFolder(token || "", variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            showToast("Folder Created!", 'success');
        },
        onError: () => showToast("Failed to create folder.", 'error')
    });

    const deleteFolderMutation = useMutation({
        mutationFn: async (ID: number) => {
            const cardsInFolder = flashcards.filter((card: Flashcard) => card.folderId === ID);
            const deletePromises = cardsInFolder.map(card => deleteFlashcard(token || "", card.ID));
            await Promise.all(deletePromises);
            return deleteFolder(token || "", ID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
            showToast("Folder and its cards deleted!", 'info');
        },
        onError: () => showToast("Failed to delete folder content.", 'error')
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
        mutationFn: (data: { ID: number, card: CreateFlashcardDTO }) => updateFlashcard(token || "", data.ID, data.card),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
            showToast("Card Updated Successfully!", 'success');
        },
        onError: () => {
            showToast("Failed to update card.", 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (ID: number) => deleteFlashcard(token || "", ID),
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

    const handleCreateCard = (newCardData: { front: string; back: string; folderId?: number | null }) => {
        createMutation.mutate(newCardData);
    };

    const handleUpdateCard = (updatedCard: { ID: number; front: string; back: string; folderId?: number | null }) => {
        updateMutation.mutate({
            ID: updatedCard.ID,
            card: { front: updatedCard.front, back: updatedCard.back, folderId: updatedCard.folderId }
        });
    };

    const handleDeleteCard = (ID: number) => {
        deleteMutation.mutate(ID);
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col text-base-content">
            <MainNavBar />

            <div className="flex flex-1 pt-24 h-[calc(100vh-theme(spacing.24))] relative">
                {/* Visual gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none z-0"></div>

                {isLoadingCards && (
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
                        flashcardCount={flashcards.length}
                        dueCount={dueCount}
                    />
                )}

                {mode === 'create' && (
                    <CreateMode
                        flashcards={flashcards}
                        onCreate={handleCreateCard}
                        onBack={handleBackToSelection}
                        folders={folders}
                        onCreateFolder={(name, parentId) => createFolderMutation.mutate({ name, parentId: parentId || null })}
                        onDeleteFolder={(ID) => deleteFolderMutation.mutate(ID)}
                        onDelete={handleDeleteCard}
                    />
                )}

                {mode === 'edit' && (
                    <EditMode
                        flashcards={flashcards}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        onBack={handleBackToSelection}
                        folders={folders}
                        onCreateFolder={(name, parentId) => createFolderMutation.mutate({ name, parentId: parentId || null })}
                        onDeleteFolder={(ID) => deleteFolderMutation.mutate(ID)}
                    />
                )}

                {mode === 'quiz' && (
                    <QuizMode
                        flashcards={flashcards}
                        folders={folders}
                        onBack={handleBackToSelection}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CreateFlashcards;
