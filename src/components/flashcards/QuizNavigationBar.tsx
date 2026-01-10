import React from 'react';

interface QuizNavigationBarProps {
    currentCardIndex: number;
    totalCards: number;
    onPrevCard: () => void;
    onNextCard: () => void;
    quizType: 'general' | 'due';
    isFirstPass: boolean;
}

const QuizNavigationBar: React.FC<QuizNavigationBarProps> = ({
    currentCardIndex,
    totalCards,
    onPrevCard,
    onNextCard,
    quizType,
    isFirstPass
}) => {
    const MAX_VISIBLE_DOTS = 5;

    let start = 0;
    let end = 0;

    if (totalCards <= MAX_VISIBLE_DOTS) {
        start = 0;
        end = Math.max(0, totalCards - 1);
    } else {
        start = currentCardIndex - Math.floor(MAX_VISIBLE_DOTS / 2);
        end = start + MAX_VISIBLE_DOTS - 1;

        if (start < 0) {
            start = 0;
            end = MAX_VISIBLE_DOTS - 1;
        }
        else if (end >= totalCards) {
            end = totalCards - 1;
            start = end - MAX_VISIBLE_DOTS + 1;
        }
    }

    const visibleRange = { start, end };

    const visibleDots = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
        const isCurrent = i === currentCardIndex;
        const isPast = i < currentCardIndex;

        visibleDots.push({
            index: i,
            isCurrent,
            isPast
        });
    }

    return (
        <div className="h-24 border-t border-base-content/10 bg-base-200/50 flex items-center justify-center gap-6">
            <button
                onClick={onPrevCard}
                disabled={currentCardIndex === 0}
                className={`btn btn-circle btn-outline btn-sm transition-all duration-200 ${currentCardIndex === 0
                    ? 'opacity-5 cursor-not-allowed'
                    : 'opacity-40 hover:opacity-100 hover:scale-110 active:scale-95'
                    }`}
                aria-label="Previous card"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="flex gap-1">
                    {visibleDots.map((dot) => (
                        <div
                            key={dot.index}
                            className={`h-1 rounded-full transition-all duration-300 ${dot.isCurrent
                                ? 'w-4 bg-primary shadow-lg shadow-primary/30' // Mai scurt decât înainte
                                : dot.isPast
                                    ? 'w-1 bg-primary/40'
                                    : 'w-1 bg-base-content/10 hover:bg-base-content/20'
                                }`}
                            title={`Card ${dot.index + 1} / ${totalCards}`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="text-primary font-bold">
                        {currentCardIndex + 1} / {totalCards}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-base-content/10"></span>
                    <span className={`uppercase tracking-wider ${quizType === 'due' ? 'text-green-500/70' : 'text-blue-500/70'
                        }`}>
                        {isFirstPass ? 'First Pass' : 'Review Pass'}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-base-content/10"></span>
                    <span className="text-base-content/40">
                        {quizType === 'due' ? 'Smart Review' : 'Practice'}
                    </span>
                </div>
            </div>

            <button
                onClick={onNextCard}
                disabled={currentCardIndex === totalCards - 1}
                className={`btn btn-circle btn-primary btn-sm transition-all duration-200 ${currentCardIndex === totalCards - 1
                    ? 'opacity-5 cursor-not-allowed'
                    : 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-110 active:scale-95'
                    }`}
                aria-label="Next card"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default QuizNavigationBar;