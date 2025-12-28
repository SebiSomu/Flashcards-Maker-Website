import React from 'react';

interface QuizCompleteCardProps {
    quizType: 'general' | 'due';
    onBack: () => void;
    onNewSession: () => void;
}

const QuizCompleteCard: React.FC<QuizCompleteCardProps> = ({
                                                               quizType,
                                                               onBack,
                                                               onNewSession
                                                           }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-base-100 animate-fade-in text-base-content w-full h-full">
            <div className="card w-full max-w-xs bg-base-200 shadow-2xl border border-base-content/10 p-6 text-center [animation:scaleIn_0.4s_ease-out_forwards]">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 blur-md"></div>
                        <span className="text-4xl relative z-10">🎉</span>
                    </div>
                </div>

                <h2 className="text-xl font-black mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {quizType === 'due' ? 'Smart Review Complete!' : 'Quiz Complete!'}
                </h2>

                <p className="text-base-content/60 text-xs mb-6 leading-relaxed">
                    {quizType === 'due'
                        ? 'Great job! You\'ve reviewed all your due cards. Your memory is getting stronger!'
                        : 'Excellent work! You\'ve completed this practice session successfully.'
                    }
                </p>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={onBack}
                        className="btn btn-primary btn-sm w-full font-bold uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                    >
                        Return to Dashboard
                    </button>

                    <button
                        onClick={onNewSession}
                        className="btn btn-outline btn-sm w-full font-bold uppercase tracking-widest border-base-content/20 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all duration-300"
                    >
                        Start New Session
                    </button>
                </div>

                <div className="mt-4 pt-4 border-t border-base-content/10">
                    <p className="text-xs text-base-content/40">
                        Keep practicing regularly! 📚
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scaleIn { 
                    from { 
                        opacity: 0; 
                        transform: scale(0.9) translate3d(0, 15px, 0); 
                    } 
                    to { 
                        opacity: 1; 
                        transform: scale(1) translate3d(0, 0, 0); 
                    } 
                }
                `}} />
        </div>
    );
};

export default QuizCompleteCard;