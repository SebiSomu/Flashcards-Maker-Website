import { useEffect, useState } from "react";

const FlashcardAnimation = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const colors = {
        ambientLight: isDark
            ? 'bg-[radial-gradient(circle,rgba(120,119,198,0.15)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)]',

        backCard: isDark
            ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/20'
            : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300/30',

        middleCard: isDark
            ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-500/20'
            : 'bg-gradient-to-br from-sky-100 to-blue-100 border-blue-300/30',

        frontCard: isDark
            ? 'bg-slate-900 border-blue-400/30'
            : 'bg-white border-blue-200',

        accentLine: isDark
            ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500'
            : 'bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400',

        circleGradient: isDark
            ? 'bg-gradient-to-tr from-blue-600/30 to-purple-600/30'
            : 'bg-gradient-to-tr from-blue-200 to-purple-200',

        circleBorder: isDark ? 'border-blue-300' : 'border-blue-400',

        line1: isDark ? 'bg-slate-700/50' : 'bg-blue-100',
        line2: isDark ? 'bg-slate-700/30' : 'bg-blue-50',
        line3: isDark ? 'bg-slate-700/20' : 'bg-blue-50/50',

        shimmer: isDark
            ? 'bg-gradient-to-bl from-blue-500/5 to-purple-500/5'
            : 'bg-gradient-to-bl from-blue-400/5 to-purple-400/5'
    };

    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 perspective-1000">
            <style>{`
                @keyframes float-1 {
                    0%, 100% { transform: translateY(-5px) rotate(0deg); }
                    50% { transform: translateY(5px) rotate(0deg); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(10px) rotate(6deg) scale(0.95); }
                    50% { transform: translateY(-5px) rotate(8deg) scale(0.95); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(-8px) rotate(-6deg) scale(0.9); }
                    50% { transform: translateY(8px) rotate(-4deg) scale(0.9); }
                }
                .animate-float-1 { animation: float-1 5s ease-in-out infinite; will-change: transform; }
                .animate-float-2 { animation: float-2 7s ease-in-out infinite; will-change: transform; }
                .animate-float-3 { animation: float-3 6s ease-in-out infinite; will-change: transform; }
            `}</style>

            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full ${colors.ambientLight} pointer-events-none`}></div>
            <div className={`absolute top-0 left-0 w-full h-full ${colors.backCard} border shadow-lg flex items-center justify-center z-10 animate-float-3`}></div>
            <div className={`absolute top-3 left-3 w-full h-full ${colors.middleCard} border shadow-lg flex items-center justify-center z-20 animate-float-2`}></div>
            <div className={`absolute top-6 left-6 w-full h-full ${colors.frontCard} rounded-xl border shadow-xl flex items-center justify-center overflow-hidden z-30 animate-float-1`}>

                <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.accentLine}`}></div>

                <div className="p-6 w-full">
                    <div className={`w-10 h-10 rounded-full ${colors.circleGradient} mb-3 flex items-center justify-center`}>
                        <div className={`w-5 h-5 border-2 ${colors.circleBorder} rounded-full`}></div>
                    </div>

                    <div className={`h-1.5 w-3/4 rounded-full mb-2.5 ${colors.line1}`}></div>
                    <div className={`h-1.5 w-1/2 rounded-full mb-2.5 ${colors.line2}`}></div>
                    <div className={`h-1.5 w-5/6 rounded-full ${colors.line3}`}></div>
                </div>

                <div className={`absolute top-0 right-0 w-full h-full ${colors.shimmer} pointer-events-none`}></div>
            </div>
        </div>
    );
};

export default FlashcardAnimation;