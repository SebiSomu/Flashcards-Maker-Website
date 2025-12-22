import { createPortal } from "react-dom";
import { useNotificationStore } from "../store/useNotificationStore";

const NotificationPopup = () => {
    const { message, type, isVisible } = useNotificationStore();

    if (!isVisible || !message) return null;

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return createPortal(
        <div className="fixed bottom-10 right-10 z-[99999] flex flex-col gap-2">
            <div className={`alert ${bgColors[type]} text-white shadow-2xl border-none min-w-[300px] flex justify-center py-4 px-6 rounded-xl animate-bounce`}>
                <div className="flex gap-3 items-center">
                    {icons[type]}
                    <span className="font-bold text-sm uppercase tracking-wider">{message}</span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NotificationPopup;
