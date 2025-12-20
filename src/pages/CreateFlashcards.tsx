import { useState } from "react";
import MainNavBar from "../components/MainNavBar";
import Footer from "../components/Footer";

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

const CreateFlashcards = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([
        { id: '1', front: 'What is React?', back: 'A JavaScript library for building user interfaces.' }, // Example
    ]);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    const handleCardClick = (card: Flashcard) => {
        setFront(card.front);
        setBack(card.back);
        setSelectedCardId(card.id);
    };

    const handleSave = () => {
        if (!front.trim() || !back.trim()) return;

        if (selectedCardId) {
            setFlashcards(flashcards.map(card =>
                card.id === selectedCardId ? { ...card, front, back } : card
            ));
        } else {
            const newCard: Flashcard = {
                id: Date.now().toString(),
                front,
                back
            };
            setFlashcards([newCard, ...flashcards]);
            setFront("");
            setBack("");
        }
    };

    const handleClearOrNew = () => {
        setFront("");
        setBack("");
        setSelectedCardId(null);
    };

    const handleDelete = () => {
        if (!selectedCardId) return;
        setFlashcards(flashcards.filter(card => card.id !== selectedCardId));
        handleClearOrNew();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <MainNavBar />

            <div className="flex flex-1 pt-24 h-screen"> {/* pt-24 to account for fixed navbar */}

                {/* Sidebar - Created Cards */}
                <div className="w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col h-full overflow-hidden shrink-0 z-20"> {/* Added z-20 and shrink-0 */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            Your Cards
                            <span className="text-slate-500 text-xs ml-1">({flashcards.length})</span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {flashcards.length === 0 && (
                            <p className="text-slate-600 text-xs text-center mt-10 italic">No cards yet. Create one!</p>
                        )}
                        {flashcards.map((card) => (
                            <div
                                key={card.id}
                                onClick={(e) => {
                                    e.preventDefault(); // Safety check
                                    handleCardClick(card);
                                }}
                                className={`group relative bg-slate-800 p-4 rounded-xl border transition-all cursor-pointer ${selectedCardId === card.id
                                    ? "border-blue-600 bg-slate-800 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                    : "border-white/5 hover:bg-slate-700 hover:border-white/10"
                                    }`}
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-xl transition-opacity ${selectedCardId === card.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    }`}></div>
                                {/* pointer-events-none on text to ensure click hits the parent div cleanly, though bubbling handles it anyway */}
                                <h3 className="text-slate-200 font-bold text-sm truncate mb-1 pointer-events-none">{card.front}</h3>
                                <p className="text-slate-500 text-xs truncate pointer-events-none">{card.back}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content - Creation/Edit Area */}
                <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden z-10">

                    {/* Visual gradients */}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none"></div>

                    <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                        {/* Static Card */}
                        <div className="card w-full max-w-2xl bg-slate-900 shadow-xl border border-white/10">
                            <div className="card-body p-8 md:p-12">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
                                    <h2 className="text-2xl text-white font-black">
                                        {selectedCardId ? "Edit Flashcard" : "Create New Flashcard"}
                                    </h2>
                                    {selectedCardId && (
                                        <div className="badge badge-primary badge-outline text-xs font-bold uppercase tracking-widest p-3">Editing Mode</div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text text-slate-400 text-xs uppercase font-bold tracking-widest">Front Side (Question)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full bg-slate-950 border-white/10 text-white focus:border-blue-600 focus:outline-none h-14"
                                            value={front}
                                            onChange={(e) => setFront(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text text-slate-400 text-xs uppercase font-bold tracking-widest">Back Side (Answer)</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-32 w-full bg-slate-950 border-white/10 text-white focus:border-blue-600 focus:outline-none text-base leading-relaxed"
                                            value={back}
                                            onChange={(e) => setBack(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="card-actions justify-between mt-8">
                                    <div>
                                        {selectedCardId && (
                                            <button
                                                className="btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border-none mr-2"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn bg-transparent border-white/20 text-white hover:bg-white/10"
                                            onClick={handleClearOrNew}
                                        >
                                            {selectedCardId ? "Cancel" : "Clear"}
                                        </button>
                                        <button
                                            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-8"
                                            onClick={handleSave}
                                        >
                                            {selectedCardId ? "Save Changes" : "Create Card"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateFlashcards;
