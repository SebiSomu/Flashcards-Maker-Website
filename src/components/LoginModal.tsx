import { useRef, useCallback } from "react";
import Button from "./Button";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        };
        console.log("Login Success:", data);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={!isOpen}
        >
            {/* Backdrop - Solid simple transparency, NO BLUR */}
            <div
                className="absolute inset-0 bg-slate-950/90"
                onClick={onClose}
            ></div>

            {/* Modal Content - NO ANIMATION, appears instantly */}
            <div
                className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-[340px] border border-blue-600 relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-black text-white mb-1 uppercase italic tracking-tighter text-left">Login</h2>
                <p className="text-slate-400 text-[11px] mb-6 uppercase tracking-wider text-left">Access System</p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-slate-300 text-[10px] font-bold mb-1 uppercase tracking-widest">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="operator@flashcraft.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-[10px] font-bold mb-1 uppercase tracking-widest">Password</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        text="Log In"
                        className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 text-xs font-black uppercase tracking-widest cursor-pointer"
                    />
                </form>
            </div>
        </div>
    );
};

export default LoginModal;