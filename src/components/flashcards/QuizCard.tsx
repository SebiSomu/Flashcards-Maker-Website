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

const QuizCard: React.FC<QuizCardProps> = React.memo(({
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
        <div className="w-full max-w-2xl [perspective:1000px]">
            <div onClick={onFlip} className="relative w-full aspect-video cursor-pointer group">
                <div
                    className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                    style={{ willChange: 'transform' }}
                >
                    {/* Front Side */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] bg-base-200 border border-base-content/5 rounded-xl flex flex-col items-center justify-center p-8 text-center group-hover:border-primary/20 transition-colors"> {/* Redus padding-ul și border-radius */}
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-primary"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="badge badge-outline border-base-content/10 text-[9px] font-black uppercase tracking-widest opacity-40">Front</span>
                            {folderName && (
                                <span className="badge badge-ghost badge-outline text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter opacity-60">
                                    {folderName}
                                </span>
                            )}
                        </div>
                        <h3 className="text-[22px] font-bold leading-snug whitespace-pre-wrap">{card.front}</h3>
                        <p className="absolute bottom-6 text-xs font-bold opacity-20 uppercase tracking-[0.2em] animate-pulse">Tap to Reveal</p> {/* Ajustat poziția */}
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-base-100 border border-primary/20 rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-[0_0_30px_rgba(37,99,235,0.1)]"> {/* Redus padding-ul, shadow-ul și border-radius */}
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="badge badge-outline border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary/50">Back</span> {/* Text mai mic */}
                            {folderName && (
                                <span className="badge badge-ghost badge-outline text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter opacity-60"> {/* Dimensiuni reduse */}
                                    {folderName}
                                </span>
                            )}
                        </div>
                        <p className="text-[20px] font-bold mb-8 leading-relaxed text-base-content/90 whitespace-pre-wrap">{card.back}</p> {/* Text mai mic, redus margin-bottom */}

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
                                        className="btn btn-primary btn-md px-8 font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
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
                                        className="btn btn-ghost btn-xs mt-4 opacity-20 hover:opacity-100 hover:text-error uppercase tracking-wider font-bold"
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
});
QuizCard.displayName = 'QuizCard';

export default QuizCard;