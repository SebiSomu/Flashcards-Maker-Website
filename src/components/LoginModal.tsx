import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback } from "react"; // Folosim useRef
import Button from "./Button";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    // Referințe directe către elementele din DOM (ca în JS pur)
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const smoothTransition = {
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.4
    } as const;

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        // Citim valorile doar la final
        const data = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        };
        console.log("Login Success:", data);
        onClose();
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-[340px] border border-blue-600 relative"
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={smoothTransition}
                        onClick={(e) => e.stopPropagation()}
                        style={{ transform: "translateZ(0)" }}
                    >
                        <h2 className="text-2xl font-black text-white mb-1 uppercase italic tracking-tighter text-left">Login</h2>
                        <p className="text-slate-400 text-[11px] mb-6 uppercase tracking-wider text-left">Access System</p>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-slate-300 text-[10px] font-bold mb-1 uppercase tracking-widest">Email</label>
                                <input
                                    ref={emailRef} // Legăm referința
                                    type="email"
                                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="operator@flashcraft.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-[10px] font-bold mb-1 uppercase tracking-widest">Password</label>
                                <input
                                    ref={passwordRef} // Legăm referința
                                    type="password"
                                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                text="Log In"
                                className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            />
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;