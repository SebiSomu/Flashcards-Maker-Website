import { useState } from "react";
import type { Folder } from "../../api/flashcards";

interface FolderListProps {
    folders: Folder[];
    onSelectFolder: (folderId: number | null) => void;
    onCreateFolder: (name: string) => void;
    onDeleteFolder: (id: number) => void;
    selectedFolderId: number | null;
}

const INITIAL_DISPLAY_COUNT = 4;

const FolderList = ({ folders, onSelectFolder, onCreateFolder, onDeleteFolder, selectedFolderId }: FolderListProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCreate = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName);
            setNewFolderName("");
            setIsCreating(false);
        }
    };

    const displayedFolders = isExpanded ? folders : folders.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMoreFolders = folders.length > INITIAL_DISPLAY_COUNT;

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 flex items-center gap-2 px-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Folders
                <span className="text-base-content/30">({folders.length})</span>
            </h3>

            <div className="flex flex-col gap-1">
                <button
                    onClick={() => onSelectFolder(null)}
                    className={`btn btn-ghost btn-sm justify-start uppercase tracking-wide text-xs font-bold h-8 min-h-0 ${selectedFolderId === null ? "btn-active bg-primary/10 text-primary" : ""}`}
                >
                    All Flashcards
                </button>
                {displayedFolders.map(folder => (
                    <div key={folder.ID} className="group flex items-center">
                        <button
                            onClick={() => onSelectFolder(folder.ID)}
                            className={`btn btn-ghost btn-sm justify-start flex-1 text-xs font-medium truncate h-8 min-h-0 ${selectedFolderId === folder.ID ? "btn-active bg-primary/10 text-primary" : ""}`}
                        >
                            {folder.name}
                        </button>
                        <button
                            onClick={() => onDeleteFolder(folder.ID)}
                            className="btn btn-ghost btn-xs btn-square text-error opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Folder"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}

                {hasMoreFolders && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="btn btn-ghost btn-xs text-primary/70 hover:text-primary mt-1"
                    >
                        {isExpanded ? "Show Less" : `Show ${folders.length - INITIAL_DISPLAY_COUNT} More`}
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="flex flex-col gap-2 animate-fade-in mt-2">
                    <input
                        type="text"
                        placeholder="Folder Name"
                        className="input input-bordered input-xs w-full"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <div className="flex gap-2">
                        <button onClick={handleCreate} className="btn btn-primary btn-xs flex-1">Save</button>
                        <button onClick={() => setIsCreating(false)} className="btn btn-ghost btn-xs">Cancel</button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn btn-outline btn-xs w-full mt-1"
                >
                    + New Folder
                </button>
            )}
        </div>
    );
};

export default FolderList;

