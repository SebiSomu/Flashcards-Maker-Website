import React, { useState } from 'react';

interface DifficultyRatingProps {
    onRate: (rating: number) => void;
}

const DifficultyRating: React.FC<DifficultyRatingProps> = ({ onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    // Colors: 
    // Light Gold for Dark Mode: #FFD700 (Gold) or #FFEC8B (Light Goldenrod)
    // Dark Gold for Light Mode: #B8860B (Dark Goldenrod)
    const starColorClass = "text-[#B8860B] dark:text-[#FFD700]";
    const inactiveStarClass = "text-base-content/60"; // Even higher opacity for better visibility

    return (
        <div className="mt-8 flex flex-col items-center animate-fade-in-up w-full z-50">
            <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">Rate Difficulty (Required)</p>
            <div
                className="flex flex-wrap justify-center gap-2"
                onMouseLeave={() => setHoverRating(0)}
            >
                {stars.map((rating) => (
                    <button
                        key={rating}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRate(rating);
                        }}
                        onMouseEnter={() => setHoverRating(rating)}
                        className={`btn btn-circle btn-lg border-base-content/10 bg-base-100 hover:scale-110 transition-all shadow-sm relative overflow-hidden ${hoverRating >= rating
                            ? 'border-[#B8860B] dark:border-[#FFD700] bg-[#B8860B]/5 dark:bg-[#FFD700]/5'
                            : ''
                        }`}
                    >
                        <div className="flex flex-col items-center leading-none z-10">
                            <span className={`text-4xl transition-colors duration-200 ${hoverRating >= rating
                                ? starColorClass
                                : inactiveStarClass
                            }`}>★</span>
                        </div>
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-[10px] uppercase font-black tracking-wider text-base-content/40">
                <span className="flex items-center gap-1">
                    EASY (1-2 <span className={starColorClass}>★</span>)
                </span>
                <span className="flex items-center gap-1">
                    MEDIUM (3 <span className={starColorClass}>★</span>)
                </span>
                <span className="flex items-center gap-1">
                    HARD (4 <span className={starColorClass}>★</span>)
                </span>
                <span className="flex items-center gap-1">
                    VERY HARD (5 <span className={starColorClass}>★</span>)
                </span>
            </div>
        </div>
    );
};

export default DifficultyRating;