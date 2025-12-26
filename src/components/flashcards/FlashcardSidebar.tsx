import React, { useState } from 'react';
import ConfirmModal from '../ConfirmModal';

interface Flashcard {
    id: number;
    front: string;
    back: string;
    folderId?: number | null;
}

interface FlashcardSidebarProps {
    flashcards: Flashcard[];
    selectedCardId: number | null;
    onCardClick: (card: Flashcard) => void;
    mode: 'create' | 'edit';
    onBack: () => void;
    onDeleteCard?: (id: number) => void;
    folderSection?: React.ReactNode;
    folders?: { ID: number; name: string }[];
}

const INITIAL_DISPLAY_COUNT = 4;

const FlashcardSidebar = ({
    flashcards,
    selectedCardId,
    onCardClick,
    mode,
    onBack,
    onDeleteCard,
    folderSection,
    folders
}: FlashcardSidebarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<number | null>(null);

    const displayedCards = isExpanded ? flashcards : flashcards.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMoreCards = flashcards.length > INITIAL_DISPLAY_COUNT;

    return (
        <div className="w-80 bg-base-200 border-r border-base-content/10 p-6 flex flex-col h-full overflow-hidden shrink-0 z-20">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content self-start pl-0 mb-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Menu
            </button>

            {/* Folder Section (above cards) */}
            {folderSection && (
                <div className="mb-6 pb-4 border-b border-base-content/10">
                    {folderSection}
                </div>
            )}

            {/* Cards Section */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <h2 className="text-base-content font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                    Your Cards
                    <span className="text-base-content/50 text-xs">({flashcards.length})</span>
                </h2>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {flashcards.length === 0 && (
                        <p className="text-base-content/40 text-xs text-center mt-6 italic">No cards yet. Create one!</p>
                    )}
                    {displayedCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={(e) => {
                                e.preventDefault();
                                if (mode === 'edit') {
                                    onCardClick(card);
                                }
                            }}
                            className={`group relative bg-base-100 p-3 rounded-lg border transition-all ${mode === 'edit' ? 'cursor-pointer' : 'cursor-default'} ${selectedCardId === card.id
                                ? "border-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                : "border-base-content/5"
                                } ${mode === 'edit' && selectedCardId !== card.id ? "hover:border-base-content/10" : ""}`}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-lg transition-opacity ${selectedCardId === card.id ? "opacity-100" : "opacity-0"
                                }`}></div>
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-base-content font-bold text-xs pointer-events-none whitespace-pre-wrap line-clamp-2">{card.front}</h3>
                                        {card.folderId && folders && (
                                            <span className="badge badge-ghost badge-outline text-[10px] h-4 leading-none px-1.5 opacity-60 shrink-0">
                                                {folders.find(f => f.ID === card.folderId)?.name || 'Folder'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base-content/70 text-xs pointer-events-none whitespace-pre-wrap line-clamp-3">{card.back}</p>
                                </div>
                                {onDeleteCard && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCardToDelete(card.id);
                                        }}
                                        className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Card"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {hasMoreCards && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="btn btn-ghost btn-xs w-full text-primary/70 hover:text-primary mt-2"
                        >
                            {isExpanded ? "Show Less" : `Show ${flashcards.length - INITIAL_DISPLAY_COUNT} More`}
                        </button>
                    )}
                </div>
            </div>

            {/* Deletion Confirmation Modal */}
            <ConfirmModal
                isOpen={cardToDelete !== null}
                onClose={() => setCardToDelete(null)}
                onConfirm={() => {
                    if (cardToDelete !== null && onDeleteCard) {
                        onDeleteCard(cardToDelete);
                    }
                }}
                title="Delete Flashcard?"
                message="This action is permanent and cannot be undone. Are you sure you want to remove this card?"
                confirmText="Delete Card"
            />
        </div>
    );
};

export default FlashcardSidebar;

