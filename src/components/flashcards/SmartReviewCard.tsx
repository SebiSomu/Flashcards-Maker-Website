import React from 'react';

interface SmartReviewCardProps {
    dueCount: number;
    folderNames: string[];
    onStart: () => void;
    onDismiss: () => void;
}

const SmartReviewCard: React.FC<SmartReviewCardProps> = ({ dueCount, folderNames, onStart, onDismiss }) => {
    return (
        <div className="relative mb-8 p-6 bg-primary/10 border-2 border-primary/30 rounded-3xl animate-pulse-subtle">
            <button
                onClick={onDismiss}
                className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost opacity-40 hover:opacity-100 z-10"
                title="Dismiss Review"
            >
                ✕
            </button>

            <div className="flex flex-col items-start gap-2 mb-4">
                <div className="flex items-center gap-3 w-full">
                    <h3 className="text-xl font-bold text-primary shrink-0">Smart Review</h3>
                    <div className="badge badge-primary font-bold px-3 py-3 h-auto text-center">
                        {dueCount} DUE
                    </div>
                </div>
                <p className="text-xs text-base-content/60 font-medium">
                    From folders: <span className="text-base-content/80">{folderNames.slice(0, 3).join(", ")}{folderNames.length > 3 ? "..." : ""}</span>
                </p>
                <p className="text-sm text-base-content/60 leading-tight">
                    Your scheduled review session is ready based on your learning history.
                </p>
            </div>

            <button
                onClick={onStart}
                className="btn btn-primary w-full font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            >
                Start Smart Review
            </button>
        </div>
    );
};

export default SmartReviewCard;
