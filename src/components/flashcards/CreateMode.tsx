import React, { useState } from 'react';
import FlashcardSidebar from './FlashcardSidebar';
import FolderList from './FolderList';
import { type Folder, type Flashcard } from "../../api/flashcards";

interface CreateModeProps {
    flashcards: Flashcard[];
    onCreate: (card: { front: string; back: string; folderId?: number | null }) => void;
    onBack: () => void;
    folders: Folder[];
    onCreateFolder: (name: string, parentId?: number | null) => void;
    onDeleteFolder: (ID: number) => void;
    onDelete: (ID: number) => void;
}

const CreateMode: React.FC<CreateModeProps> = ({ flashcards, onCreate, onBack, folders, onCreateFolder, onDeleteFolder, onDelete }) => {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

    const handleClearForm = () => {
        setFront("");
        setBack("");
    };

    const handleSave = () => {
        if (!front.trim() || !back.trim()) return;

        onCreate({
            front,
            back,
            folderId: selectedFolderId
        });
        handleClearForm();
    };

    // Filter flashcards for sidebar based on selected folder
    const filteredFlashcards = flashcards.filter(card =>
        selectedFolderId === null || card.folderId === selectedFolderId
    );

    return (
        <div className="flex flex-1 w-full h-full relative z-10 overflow-hidden text-base-content">
            <FlashcardSidebar
                flashcards={filteredFlashcards}
                selectedCardId={null}
                onCardClick={() => { }}
                mode="create"
                onBack={onBack}
                onDeleteCard={onDelete}
                folders={folders}
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

            <div className="flex-1 flex flex-col bg-base-100/50 p-6 md:p-10">
                <div className="flex-1 flex items-center justify-center">
                    <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-content/10">
                        <div className="card-body p-8 md:p-12 animate-fade-in">
                            <div className="flex justify-between items-center border-b border-base-content/10 pb-4 mb-8">
                                <h2 className="text-2xl font-black">Create New Flashcard</h2>
                                <div className="badge badge-outline text-xs font-bold uppercase tracking-widest p-3 badge-accent whitespace-nowrap">Creation Mode</div>
                            </div>

                            <div className="space-y-6">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Assign to Folder</span></label>
                                    <select
                                        className="select select-bordered w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none"
                                        value={selectedFolderId || ""}
                                        onChange={(e) => setSelectedFolderId(e.target.value ? Number(e.target.value) : null)}
                                    >
                                        <option value="">(Uncategorized)</option>
                                        {folders.map(folder => (<option key={folder.ID} value={folder.ID}>{folder.name}</option>))}
                                    </select>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Front Side</span></label>
                                    <textarea
                                        className="textarea textarea-bordered h-20 w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-base"
                                        value={front}
                                        onChange={(e) => setFront(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Back Side</span></label>
                                    <textarea
                                        className="textarea textarea-bordered h-32 w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-base leading-relaxed"
                                        value={back}
                                        onChange={(e) => setBack(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-8">
                                <button className="btn bg-transparent border-base-content/20 text-base-content hover:bg-base-content/10 font-bold mr-2" onClick={handleClearForm}>Clear</button>
                                <button className="btn bg-primary hover:bg-primary/90 text-primary-content border-none px-8 font-bold uppercase tracking-widest" onClick={handleSave}>Create Card</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMode;
