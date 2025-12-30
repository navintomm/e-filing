"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Scale, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignUp) {
                const { createUserWithEmailAndPassword } = await import("firebase/auth");
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                setError("Email is already in use. Try signing in.");
            } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
                setError("Invalid email or password.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError(err.message || "Authentication failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 animate-fadeInUp">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="mx-auto mb-6">
                        <img
                            src="/logo.png"
                            alt="Rones & Das Associates"
                            className="h-24 w-auto mx-auto"
                        />
                    </div>
                    <h1 className="section-header text-4xl">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="section-subheader mt-2">
                        {isSignUp ? "Start your legal journey" : "Sign in to your account"}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600">
                            {isSignUp ? "Already have an account?" : "New to the platform?"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-all"
                        >
                            {isSignUp ? "Sign In" : "Create Account"}
                        </button>
                    </div>
                </div>

                {/* Premium Login Card */}
                <div className="glass-container">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="input-legal-icon"
                                    placeholder="advocate@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    required
                                    className="input-legal-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-legal-primary w-full disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                            {loading && (
                                <span className="absolute inset-0 bg-white/20 animate-shimmer"></span>
                            )}
                            <span className="relative">
                                {loading
                                    ? isSignUp
                                        ? "Creating account..."
                                        : "Signing in..."
                                    : isSignUp
                                        ? "Create Account"
                                        : "Sign In"}
                            </span>
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-600">Secure & Encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
