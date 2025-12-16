'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, FileText, GraduationCap, LogIn, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function Header() {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-blue-500/20 dark:border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/visionix-logo.png"
                            alt="VisioniX Logo"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            VisioniX
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-blue-500/10 dark:hover:bg-white/10 transition-colors duration-200"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/summary"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-blue-500/10 dark:hover:bg-white/10 transition-colors duration-200"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="hidden sm:inline">Summary</span>
                                </Link>
                                <Link
                                    href="/quiz"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-blue-500/10 dark:hover:bg-white/10 transition-colors duration-200"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="hidden sm:inline">Quiz</span>
                                </Link>
                                <Link
                                    href="/tutorial"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-blue-500/10 dark:hover:bg-white/10 transition-colors duration-200"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tutorial</span>
                                </Link>
                            </>
                        )}

                        <ThemeToggle />

                        {/* Auth buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 dark:bg-white/10">
                                    <User className="w-4 h-4 text-blue-500 dark:text-white" />
                                    <span className="text-sm text-foreground">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors duration-200"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
