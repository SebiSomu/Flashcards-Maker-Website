import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
    const btnColor = type === 'danger' ? 'btn-error' : type === 'warning' ? 'btn-warning' : 'btn-info';
    const bgColor = type === 'danger' ? 'bg-red-500/10' : type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-2xl w-full max-w-[320px] border border-base-content/10 relative z-10 animate-scale-in">
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {type === 'danger' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                        </svg>
                    </div>

                    <h2 className="text-xl font-black text-base-content uppercase italic tracking-tighter mb-2">
                        {title}
                    </h2>
                    <p className="text-base-content/60 text-xs font-medium leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex flex-col w-full gap-2">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`btn btn-sm ${btnColor} w-full font-black uppercase tracking-widest text-xs h-10`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-ghost w-full font-bold uppercase tracking-wider text-[10px] text-base-content/40 hover:text-base-content"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
