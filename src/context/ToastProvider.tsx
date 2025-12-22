import React, { useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext, type ToastType } from './ToastContext';

interface ToastData {
    id: number;
    message: string;
    type: ToastType;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);



        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-5 right-5 z-[999999] flex flex-col gap-3 pointer-events-none">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            onClick={() => removeToast(toast.id)}
                            className={`
                                pointer-events-auto cursor-pointer
                                min-w-[300px] p-4 rounded-xl shadow-2xl text-white font-bold text-sm tracking-wide uppercase
                                transition-all duration-300 animate-bounce
                                flex items-center gap-3
                                ${toast.type === 'success' ? 'bg-emerald-500' : ''}
                                ${toast.type === 'error' ? 'bg-red-500' : ''}
                                ${toast.type === 'info' ? 'bg-blue-500' : ''}
                            `}
                        >
                            {toast.type === 'success' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                            {toast.type === 'error' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                            {toast.message}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
