import React from 'react';
import { type Flashcard } from '../../api/flashcards';
import DifficultyRating from './DifficultyRating';

interface QuizCardProps {
    card: Flashcard;
    folderName?: string;
    isFlipped: boolean;
    onFlip: () => void;
    isFirstPass: boolean;
    onRate?: (rating: number) => void;
    onNextCard?: () => void;
    onEndSession?: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
    card,
    folderName,
    isFlipped,
    onFlip,
    isFirstPass,
    onRate,
    onNextCard,
    onEndSession
}) => {
    return (
        <div className="w-full max-w-3xl [perspective:1000px]">
            <div onClick={onFlip} className="relative w-full aspect-video md:aspect-[2/1] cursor-pointer group">
                <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Front Side */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] bg-base-200 border-2 border-base-content/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center group-hover:border-primary/20 transition-colors">
                        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 to-primary"></div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="badge badge-outline border-base-content/10 text-[10px] font-black uppercase tracking-widest opacity-40">Front</span>
                            {folderName && (
                                <span className="badge badge-ghost badge-outline text-[10px] h-5 px-2 font-bold uppercase tracking-tighter opacity-60">
                                    {folderName}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight whitespace-pre-wrap">{card.front}</h3>
                        <p className="absolute bottom-8 text-xs font-bold opacity-20 uppercase tracking-[0.2em] animate-pulse">Tap to Reveal</p>
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-base-100 border-2 border-primary/20 rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500"></div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="badge badge-outline border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary/50">Back</span>
                            {folderName && (
                                <span className="badge badge-ghost badge-outline text-[10px] h-5 px-2 font-bold uppercase tracking-tighter opacity-60">
                                    {folderName}
                                </span>
                            )}
                        </div>
                        <p className="text-xl md:text-2xl font-bold mb-10 leading-relaxed text-base-content/90 whitespace-pre-wrap">{card.back}</p>

                        {isFirstPass ? (
                            onRate && <DifficultyRating onRate={onRate} />
                        ) : (
                            <div className="flex flex-col items-center animate-fade-in-up">
                                {onNextCard && (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onNextCard(); 
                                        }} 
                                        className="btn btn-primary btn-lg px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/30"
                                    >
                                        Got it!
                                    </button>
                                )}
                                {onEndSession && (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onEndSession(); 
                                        }} 
                                        className="btn btn-ghost btn-xs mt-6 opacity-20 hover:opacity-100 hover:text-error uppercase tracking-widest font-black"
                                    >
                                        End Session
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;

