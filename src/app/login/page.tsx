'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, register, isLoading } = useAuth();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (isLoginMode) {
            const success = await login(formData.email, formData.password);
            if (success) {
                router.push('/'); // Redirect to home page after login
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } else {
            if (!formData.name || !formData.email || !formData.password) {
                setError('Please fill in all fields.');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            const success = await register(formData.name, formData.email, formData.password);
            if (success) {
                // Show success message and switch to login mode
                setSuccessMessage('Account created successfully! Please sign in.');
                setIsLoginMode(true);
                setFormData({ ...formData, name: '' }); // Keep email, clear name
            } else {
                setError('Email already exists. Please try a different one.');
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image
                            src="/visionix-logo.png"
                            alt="VisioniX Logo"
                            width={60}
                            height={60}
                            className="rounded-xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        VisioniX
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isLoginMode ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
                    </p>
                </div>

                {/* Form Card */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name field (only for register) */}
                            {!isLoginMode && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-muted border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Success message */}
                            {successMessage && (
                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                                    {successMessage}
                                </div>
                            )}
                            {/* Submit button */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {isLoginMode ? 'Signing in...' : 'Creating account...'}
                                    </>
                                ) : (
                                    <>
                                        {isLoginMode ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Toggle login/register */}
                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginMode(!isLoginMode);
                                        setError('');
                                    }}
                                    className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                                >
                                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
