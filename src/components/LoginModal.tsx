import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Button from "./Button";
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
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Reset mode when modal opens
    useEffect(() => {
        if (isOpen) setMode(defaultMode);
    }, [isOpen, defaultMode]);

    const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await axios.post<LoginResponse>("http://localhost:8080/login", credentials);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Login Success:", data);
            setAuth(data.user, data.token);
            onClose();
            navigate("/create");
        },
        onError: (error) => {
            console.error("Login Failed:", error);
            alert("Login failed! Please check your credentials or server connection.");
        }
    });

    const registerMutation = useMutation<any, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await axios.post("http://localhost:8080/api/register", credentials);
            return response.data;
        },
        onSuccess: (data, variables) => {
            console.log("Registration Success:", data);
            // Auto-login after successful registration
            loginMutation.mutate(variables);
        },
        onError: (error) => {
            console.error("Registration Failed:", error);
            alert("Registration failed! Email might already be in use.");
        }
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
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
            {/* Backdrop - Solid simple transparency, NO BLUR */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            ></div>

            {/* Modal Content - NO ANIMATION, appears instantly */}
            <div
                className="bg-base-200 p-8 rounded-lg shadow-xl w-full max-w-[340px] border border-primary relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-black text-base-content mb-1 uppercase italic tracking-tighter text-left">
                    {isLogin ? "Login" : "Register"}
                </h2>
                <p className="text-base-content/60 text-[11px] mb-6 uppercase tracking-wider text-left">
                    {isLogin ? "Access System" : "Create Account"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-base-content/70 text-[10px] font-bold mb-1 uppercase tracking-widest">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            className="w-full p-2.5 bg-base-100 border border-base-content/20 rounded text-sm text-base-content focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="operator@flashcraft.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-base-content/70 text-[10px] font-bold mb-1 uppercase tracking-widest">Password</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            className="w-full p-2.5 bg-base-100 border border-base-content/20 rounded text-sm text-base-content focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        text={isLoading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Log In" : "Sign Up")}
                        className="w-full bg-primary text-primary-content py-2.5 rounded hover:bg-primary/90 text-xs font-black uppercase tracking-widest cursor-pointer"
                        disabled={isLoading}
                    />

                    {(loginMutation.isError || registerMutation.isError) && (
                        <p className="text-error text-[10px] uppercase font-bold mt-2 text-center">
                            {isLogin ? "Login Failed. Try again." : "Registration Failed. Try again."}
                        </p>
                    )}

                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-base-content/60 uppercase font-bold tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => setMode(isLogin ? 'register' : 'login')}>
                            {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
