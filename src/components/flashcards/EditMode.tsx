import React, { useState } from 'react';
import FlashcardSidebar from './FlashcardSidebar';
import FolderList from './FolderList';
import type { Folder } from "../../api/flashcards";

interface Flashcard {
    id: number;
    front: string;
    back: string;
    folderId?: number | null;
}

interface EditModeProps {
    flashcards: Flashcard[];
    onUpdate: (card: Flashcard) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    folders: Folder[];
    onCreateFolder: (name: string) => void;
    onDeleteFolder: (id: number) => void;
}

const EditMode: React.FC<EditModeProps> = ({ flashcards, onUpdate, onDelete, onBack, folders, onCreateFolder, onDeleteFolder }) => {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const handleCardClick = (card: Flashcard) => {
        setFront(card.front);
        setBack(card.back);
        setSelectedCardId(card.id);
    };

    const handleClearForm = () => {
        setFront("");
        setBack("");
        setSelectedCardId(null);
    };

    const handleSave = () => {
        if (!front.trim() || !back.trim() || !selectedCardId) return;

        const updatedCard: Flashcard = {
            id: selectedCardId,
            front,
            back
        };
        onUpdate(updatedCard);
    };

    const handleDelete = () => {
        if (!selectedCardId) return;
        onDelete(selectedCardId);
        handleClearForm();
    };

    // Filter flashcards based on selected folder
    const filteredFlashcards = flashcards.filter(card =>
        selectedFolderId === null || card.folderId === selectedFolderId
    );

    return (
        <div className="flex flex-1 w-full h-full relative z-10 overflow-hidden">
            {/* Unified Sidebar with Folders above Cards */}
            <FlashcardSidebar
                flashcards={filteredFlashcards}
                selectedCardId={selectedCardId}
                onCardClick={handleCardClick}
                mode="edit"
                onBack={onBack}
                onDeleteCard={onDelete}
                folderSection={
                    <FolderList
                        folders={folders}
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                        onCreateFolder={onCreateFolder}
                        onDeleteFolder={onDeleteFolder}
                    />
                }
            />

            {/* Main Content - Edit Area */}
            <div className="flex-1 flex flex-col bg-base-100/50 p-6 md:p-10">
                <div className="flex-1 flex items-center justify-center">
                    <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-content/10">
                        {/* Edit Mode Empty State */}
                        {!selectedCardId ? (
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
                            /* Form (Edit Mode) */
                            <div className="card-body p-8 md:p-12 animate-fade-in">
                                <div className="flex justify-between items-center border-b border-base-content/10 pb-4 mb-8">
                                    <h2 className="text-2xl text-base-content font-black">
                                        Edit Flashcard
                                    </h2>
                                    <div className="badge badge-outline text-xs font-bold uppercase tracking-widest p-3 badge-primary">
                                        Editing Mode
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
                                        <button
                                            className="btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border-none mr-2"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn bg-transparent border-base-content/20 text-base-content hover:bg-base-content/10"
                                            onClick={handleClearForm}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn bg-primary hover:bg-primary/90 text-primary-content border-none px-8"
                                            onClick={handleSave}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMode;

