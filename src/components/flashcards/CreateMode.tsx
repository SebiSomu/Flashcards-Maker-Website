import React, { useState } from 'react';
import FlashcardSidebar from './FlashcardSidebar';

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

interface CreateModeProps {
    flashcards: Flashcard[];
    onCreate: (card: Flashcard) => void;
    onBack: () => void;
}

const CreateMode: React.FC<CreateModeProps> = ({ flashcards, onCreate, onBack }) => {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const handleClearForm = () => {
        setFront("");
        setBack("");
    };

    const handleSave = () => {
        if (!front.trim() || !back.trim()) return;

        const newCard: Flashcard = {
            id: Date.now().toString(),
            front,
            back
        };
        onCreate(newCard);
        handleClearForm();
    };

    return (
        <div className="flex flex-1 w-full h-full relative z-10 overflow-hidden">
            {/* Sidebar - Created Cards */}
            <FlashcardSidebar
                flashcards={flashcards}
                selectedCardId={null}
                onCardClick={() => { }} // No-op for Create Mode
                mode="create"
                onBack={onBack}
            />

            {/* Main Content - Creation Area */}
            <div className="flex-1 flex flex-col bg-base-100/50 p-6 md:p-10">
                <div className="flex-1 flex items-center justify-center">
                    <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-content/10">
                        <div className="card-body p-8 md:p-12 animate-fade-in">
                            <div className="flex justify-between items-center border-b border-base-content/10 pb-4 mb-8">
                                <h2 className="text-2xl text-base-content font-black">
                                    Create New Flashcard
                                </h2>
                                <div className="badge badge-outline text-xs font-bold uppercase tracking-widest p-3 badge-accent">
                                    Creation Mode
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

                            <div className="card-actions justify-end mt-8">
                                <div className="flex gap-2">
                                    <button
                                        className="btn bg-transparent border-base-content/20 text-base-content hover:bg-base-content/10"
                                        onClick={handleClearForm}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        className="btn bg-primary hover:bg-primary/90 text-primary-content border-none px-8"
                                        onClick={handleSave}
                                    >
                                        Create Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMode;
