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
    onEditFolder: (ID: number, newName: string) => void;
    onDelete: (ID: number) => void;
}

const CreateMode: React.FC<CreateModeProps> = ({ flashcards, onCreate, onBack, folders, onCreateFolder, onDeleteFolder, onEditFolder, onDelete }) => {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClearForm = () => {
        setFront("");
        setBack("");
        setSelectedFolderId(null);
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
                        onEditFolder={onEditFolder}
                    />
                }
            />

            <div className="flex-1 flex flex-col bg-base-100/50 p-6 md:p-8">
                <div className="flex-1 flex items-center justify-center">
                    <div className="card w-full max-w-lg bg-base-200 shadow-xl border border-base-content/10">
                        <div className="card-body p-6 md:p-8 animate-fade-in">
                            <div className="flex justify-between items-center border-b border-base-content/10 pb-3.5 mb-6">
                                <h2 className="text-lg font-black">Create New Flashcard</h2>
                                <div className="badge badge-outline text-[10px] font-bold uppercase tracking-widest p-2.5 badge-accent whitespace-nowrap">Creation Mode</div>
                            </div>

                            <div className="space-y-4">
                                <div className="form-control w-full">
                                    <label className="label py-1"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Assign to Folder</span></label>
                                    <div className="relative w-full">
                                        <div
                                            role="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="select select-bordered select-sm w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-sm flex items-center justify-between"
                                        >
                                            <span>{selectedFolderId ? folders.find(f => f.ID === selectedFolderId)?.name : "(Uncategorized)"}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </div>

                                        {isDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-[50]"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                ></div>
                                                <ul className="absolute left-0 top-full mt-1 z-[60] p-1 shadow-2xl bg-base-200 border border-base-content/10 rounded-xl w-full max-h-[160px] overflow-y-auto flex flex-col gap-1">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedFolderId(null);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors ${!selectedFolderId ? 'bg-primary/20 font-bold' : ''}`}
                                                        >
                                                            (Uncategorized)
                                                        </button>
                                                    </li>
                                                    {folders.map(folder => (
                                                        <li key={folder.ID}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedFolderId(folder.ID);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors ${selectedFolderId === folder.ID ? 'bg-primary/20 font-bold' : ''}`}
                                                            >
                                                                {folder.name}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label py-1"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Front Side</span></label>
                                    <textarea
                                        className="textarea textarea-bordered h-14 w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-sm"
                                        value={front}
                                        onChange={(e) => setFront(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label py-1"><span className="label-text text-base-content/60 text-xs uppercase font-bold tracking-widest">Back Side</span></label>
                                    <textarea
                                        className="textarea textarea-bordered h-24 w-full bg-base-100 border-base-content/10 text-base-content focus:border-primary focus:outline-none text-sm leading-relaxed"
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
