import React from 'react';

export interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
    secondaryButton?: {
        text: string;
        onClick: () => void;
    };
    type?: 'info' | 'warning' | 'success';
    icon?: React.ReactNode;
    isFullPage?: boolean;
}

export const InfoModal = ({
    isOpen,
    onClose,
    title,
    message,
    buttonText = "Got it",
    secondaryButton,
    type = 'info',
    icon,
    isFullPage = false
}: InfoModalProps) => {
    if (!isOpen && !isFullPage) return null;

    const accentColor = type === 'warning' ? 'text-yellow-500' : type === 'success' ? 'text-emerald-500' : 'text-blue-500';
    const btnColor = type === 'warning' ? 'btn-warning' : type === 'success' ? 'btn-success' : 'btn-info';
    const bgColor = type === 'warning' ? 'bg-yellow-500/10' : type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10';

    const content = (
        <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
                {icon ? (
                    <div className="text-3xl">{icon}</div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {type === 'warning' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        ) : type === 'success' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                )}
            </div>

            <h2 className={`text-xl font-black uppercase tracking-tight mb-2 ${type === 'success' ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' : 'text-base-content'}`}>
                {title}
            </h2>
            <p className="text-base-content/60 text-sm font-medium leading-relaxed mb-6">
                {message}
            </p>

            <div className="flex flex-col w-full gap-2">
                <button
                    onClick={onClose}
                    className={`btn btn-sm ${type === 'success' ? 'btn-primary' : btnColor} w-full font-bold uppercase tracking-widest text-xs h-10`}
                >
                    {buttonText}
                </button>
                {secondaryButton && (
                    <button
                        onClick={secondaryButton.onClick}
                        className="btn btn-sm btn-outline btn-ghost w-full font-bold uppercase tracking-widest text-xs h-10 border-base-content/10"
                    >
                        {secondaryButton.text}
                    </button>
                )}
            </div>
        </div>
    );

    if (isFullPage) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-base-100 animate-fade-in text-base-content w-full h-full relative z-10">
                <div className="bg-base-200 p-8 rounded-2xl shadow-2xl w-full max-w-[340px] border border-base-content/10 [animation:scaleIn_0.4s_ease-out_forwards]">
                    {content}
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
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="bg-base-200 p-6 rounded-2xl shadow-2xl w-full max-w-[320px] border border-base-content/10 relative z-10 [animation:scaleIn_0.3s_ease-out_forwards]">
                {content}
            </div>
        </div>
    );
};

export default InfoModal;
