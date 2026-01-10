import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        setMode(defaultMode);
    }, [defaultMode]);

    useEffect(() => {
        if (isOpen) {
            setErrorMessage(null);
            setEmail("");
            setPassword("");
            setShowEmailError(false);
            setShowPasswordError(false);
        }
    }, [isOpen]);

    const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await axios.post<LoginResponse>(`${BASE_URL}/api/login`, credentials);
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
            const response = await axios.post(`${BASE_URL}/api/register`, credentials);
            return response.data;
        },
        onSuccess: (_, variables) => {
            setErrorMessage(null);
            // Auto-login after successful registration
            loginMutation.mutate(variables);
        },
        onError: (err) => {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setErrorMessage(err.response.data.error);
            } else {
                setErrorMessage("Registration failed. Please check your details.");
            }
        }
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setShowEmailError(false);
        setShowPasswordError(false);

        let hasError = false;

        if (!email || !email.includes('@')) {
            setShowEmailError(true);
            setErrorMessage(email ? "Invalid email format" : "Email is required");
            hasError = true;
        }

        if (!password || (mode === 'register' && password.length < 6)) {
            setShowPasswordError(true);
            if (!password) {
                setErrorMessage("Password is required");
            } else if (mode === 'register') {
                setErrorMessage("Password is too short (min. 6 characters)");
            }
            hasError = true;
        }

        if (hasError) return;

        const data = {
            email: email,
            password: password
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

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    <div className="space-y-1">
                        <label className={`text-[9px] font-black uppercase tracking-widest transition-colors ml-1 ${showEmailError ? 'text-red-500' : 'text-base-content/40'}`}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (showEmailError) setShowEmailError(false);
                            }}
                            className={`input input-sm input-bordered w-full bg-base-100 focus:outline-none text-xs transition-all ${showEmailError ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                            placeholder="hello@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest transition-colors ${showPasswordError ? 'text-red-500' : password.length >= 6 ? 'text-green-500' : 'text-base-content/40'}`}>
                                Password
                            </label>
                            {mode === 'register' && (
                                <span className={`text-[8px] font-bold uppercase ${showPasswordError ? 'text-red-500' : password.length >= 6 ? 'text-green-500' : 'text-base-content/30'}`}>
                                    {password.length}/6
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (showPasswordError) setShowPasswordError(false);
                            }}
                            className={`input input-sm input-bordered w-full bg-base-100 focus:outline-none text-xs transition-all ${showPasswordError ? 'border-red-500 focus:border-red-500' : password.length >= 6 && mode === 'register' ? 'border-green-500/50 focus:border-green-500' : 'focus:border-primary'}`}
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
                                setEmail("");
                                setPassword("");
                                setShowEmailError(false);
                                setShowPasswordError(false);
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
