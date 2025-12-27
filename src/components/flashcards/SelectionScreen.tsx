import React from 'react';

interface SelectionScreenProps {
    onSelectCreate: () => void;
    onSelectEdit: () => void;
    onSelectQuiz: () => void;
    flashcardCount: number;
    dueCount: number;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({
    onSelectCreate,
    onSelectEdit,
    onSelectQuiz,
    flashcardCount,
    dueCount
}) => {
    return (
        <div className="flex h-full w-full max-w-5xl mx-auto px-6 pt-6">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-10 z-10 animate-fade-in-up">
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-5xl font-black text-base-content mb-4 tracking-tight">
                        Flashcards Maker
                    </h1>
                    <p className="text-md text-base-content/60 max-w-lg mx-auto">
                        Manage your knowledge or test your skills. Choose a mode to get started.
                    </p>
                    <p className="text-xs font-bold bg-base-200 inline-block px-3 py-0.5 rounded-full mt-3 text-base-content/50 uppercase tracking-widest border border-base-content/5">
                        All Collection: {flashcardCount} Cards
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                    {/* Create Card */}
                    <div
                        onClick={onSelectCreate}
                        className="group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden text-left"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-emerald-500 transition-colors">Create</h2>
                        <p className="text-base-content/60">Add new flashcards to your collection quickly and efficiently.</p>
                    </div>

                    {/* Edit Card */}
                    <div
                        onClick={onSelectEdit}
                        className="group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden text-left"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-blue-500 transition-colors">Edit</h2>
                        <p className="text-base-content/60">Modify, delete or review your existing flashcards.</p>
                    </div>

                    {/* Quiz Card */}
                    <div
                        onClick={onSelectQuiz}
                        className={`group relative bg-base-200 p-8 rounded-3xl border border-base-content/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer overflow-hidden text-left ${flashcardCount === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 transition-all group-hover:w-full group-hover:opacity-5"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            {dueCount > 0 && (
                                <div className="badge badge-primary badge-lg animate-bounce font-black shadow-lg shadow-primary/20">
                                    {dueCount} DUE
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-purple-500 transition-colors">Quiz</h2>
                        <p className="text-base-content/60">Test your knowledge with a randomized quiz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionScreen;

