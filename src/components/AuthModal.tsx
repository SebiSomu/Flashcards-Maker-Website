import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginResponse } from "../types";

interface LoginCredentials {
    email?: string;
    password?: string;
}

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
}

const LoginModal = ({ isOpen, onClose, defaultMode = 'login' }: LoginModalProps) => {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        setMode(defaultMode);
    }, [defaultMode]);

    useEffect(() => {
        if (isOpen) {
            setErrorMessage(null);
        }
    }, [isOpen]);

    const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await axios.post<LoginResponse>("http://localhost:8080/login", credentials);
            return response.data;
        },
        onSuccess: (data) => {
            setErrorMessage(null);
            setAuth(data.user, data.token);
            onClose();
            navigate("/create");
        },
        onError: () => {
            setErrorMessage("Invalid email or password.");
        }
    });

    const registerMutation = useMutation<unknown, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await axios.post("http://localhost:8080/api/register", credentials);
            return response.data;
        },
        onSuccess: (_, variables) => {
            setErrorMessage(null);
            // Auto-login after successful registration
            loginMutation.mutate(variables);
        },
        onError: () => {
            setErrorMessage("Registration failed. Email might be in use.");
        }
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        const data = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        };

        if (mode === 'login') {
            loginMutation.mutate(data);
        } else {
            registerMutation.mutate(data);
        }
    }, [loginMutation, registerMutation, mode]);

    if (!isOpen) return null;

    const isLoading = loginMutation.isPending || registerMutation.isPending;
    const isLogin = mode === 'login';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={!isOpen}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content - Smaller size (max-w-[300px]) */}
            <div
                className="bg-base-200 p-6 rounded-2xl shadow-2xl w-full max-w-[300px] border border-base-content/10 relative z-10 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-base-content uppercase italic tracking-tighter">
                            {isLogin ? "Welcome Back" : "Join Us"}
                        </h2>
                        <p className="text-base-content/50 text-[10px] uppercase tracking-widest font-bold">
                            {isLogin ? "Login to continue" : "Create new account"}
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-xs btn-circle btn-ghost text-base-content/50">✕</button>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-base-content/40 ml-1">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            className="input input-sm input-bordered w-full bg-base-100 focus:outline-none focus:border-primary text-xs"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-base-content/40 ml-1">Password</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            className="input input-sm input-bordered w-full bg-base-100 focus:outline-none focus:border-primary text-xs"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-sm btn-primary w-full mt-4 font-black uppercase tracking-widest text-xs"
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="loading loading-spinner loading-xs"></span> : (isLogin ? "Log In" : "Sign Up")}
                    </button>

                    <div className="pt-4 text-center border-t border-base-content/5 mt-4">
                        <p
                            className="text-[10px] font-bold text-base-content/50 hover:text-primary cursor-pointer transition-colors uppercase tracking-wider"
                            onClick={() => {
                                setMode(isLogin ? 'register' : 'login');
                                setErrorMessage(null);
                            }}
                        >
                            {isLogin ? "Create an account" : "Back to Login"}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
