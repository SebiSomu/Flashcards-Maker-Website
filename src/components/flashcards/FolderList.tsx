import { useState } from "react";
import { type Folder } from "../../api/flashcards";
import ConfirmModal from "../ConfirmModal";

interface FolderListProps {
    folders: Folder[];
    onSelectFolder: (ID: number | null) => void;
    onCreateFolder: (name: string, parentId?: number) => void;
    onDeleteFolder: (ID: number) => void;
    selectedFolderId: number | null;
}

interface TreeNodeProps {
    folder: Folder;
    allFolders: Folder[];
    level: number;
    selectedFolderId: number | null;
    onSelect: (ID: number) => void;
    onDelete: (ID: number) => void;
    onCreateSubfolder: (parentId: number) => void;
}

const TreeNode = ({ folder, allFolders, level, selectedFolderId, onSelect, onDelete, onCreateSubfolder }: TreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const children = allFolders.filter(f => f.parentId === folder.ID);
    const hasChildren = children.length > 0;

    return (
        <div className="flex flex-col select-none">
            <div className={`group flex items-center hover:bg-base-200/50 rounded-lg pr-2 transition-colors ${selectedFolderId === folder.ID ? "bg-primary/10 text-primary" : ""}`} style={{ paddingLeft: `${level * 12}px` }}>
                {hasChildren ? (
                    <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="p-1 opacity-50 hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                ) : <span className="w-5"></span>}
                <button onClick={() => onSelect(folder.ID)} className={`btn btn-ghost btn-sm justify-start flex-1 text-xs font-medium truncate h-8 min-h-0 px-1 ${selectedFolderId === folder.ID ? "text-primary font-bold" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    {folder.name}
                </button>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onCreateSubfolder(folder.ID); }} className="btn btn-ghost btn-xs text-base-content/50 hover:text-primary font-bold">+</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(folder.ID); }} className="btn btn-ghost btn-xs text-error/50 hover:text-error font-bold">×</button>
                </div>
            </div>
            {isExpanded && <div className="flex flex-col">{children.map(child => <TreeNode key={child.ID} folder={child} allFolders={allFolders} level={level + 1} selectedFolderId={selectedFolderId} onSelect={onSelect} onDelete={onDelete} onCreateSubfolder={onCreateSubfolder} />)}</div>}
        </div>
    );
};

const FolderList = ({ folders, onSelectFolder, onCreateFolder, onDeleteFolder, selectedFolderId }: FolderListProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [targetParentId, setTargetParentId] = useState<number | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<number | null>(null);

    const handleCreate = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName, targetParentId || undefined);
            setNewFolderName("");
            setTargetParentId(null);
            setIsCreating(false);
        }
    };

    const handleStartCreate = (parentId: number | null = null) => {
        setTargetParentId(parentId);
        setIsCreating(true);
    };

    const rootFolders = folders.filter(f => !f.parentId);

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 flex items-center justify-between px-1">
                <span>Folders</span>
                <button onClick={() => handleStartCreate(null)} className="btn btn-ghost btn-xs btn-circle text-primary font-bold">+</button>
            </h3>
            <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto pr-2">
                <button onClick={() => onSelectFolder(null)} className={`btn btn-ghost btn-sm justify-start uppercase tracking-wide text-xs font-bold h-8 min-h-0 ${selectedFolderId === null ? "bg-primary/10 text-primary" : ""}`}><span className="w-5"></span>All Cards</button>
                {rootFolders.map(folder => <TreeNode key={folder.ID} folder={folder} allFolders={folders} level={0} selectedFolderId={selectedFolderId} onSelect={onSelectFolder} onDelete={setFolderToDelete} onCreateSubfolder={handleStartCreate} />)}
            </div>
            {isCreating && (
                <div className="flex flex-col gap-2 p-2 bg-base-200 rounded-lg border border-base-content/10 mt-2">
                    <input type="text" placeholder="New Folder" className="input input-bordered input-xs focus:outline-none" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                    <div className="flex gap-2">
                        <button onClick={handleCreate} className="btn btn-primary btn-xs flex-1">Add</button>
                        <button onClick={() => setIsCreating(false)} className="btn btn-ghost btn-xs">Cancel</button>
                    </div>
                </div>
            )}
            <ConfirmModal isOpen={folderToDelete !== null} onClose={() => setFolderToDelete(null)} onConfirm={() => { if (folderToDelete !== null) { onDeleteFolder(folderToDelete); setFolderToDelete(null); } }} title="Delete Folder?" message="This will delete the folder and subfolders." confirmText="Delete" />
        </div>
    );
};

export default FolderList;