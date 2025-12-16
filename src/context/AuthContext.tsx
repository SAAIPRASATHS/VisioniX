'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('visionix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call - in production, this would be a real API
        setIsLoading(true);

        try {
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('visionix_users') || '[]');
            const foundUser = users.find((u: { email: string; password: string }) =>
                u.email === email && u.password === password
            );

            if (foundUser) {
                const userData = { email: foundUser.email, name: foundUser.name };
                setUser(userData);
                localStorage.setItem('visionix_user', JSON.stringify(userData));
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('visionix_users') || '[]');

            // Check if email already exists
            if (users.some((u: { email: string }) => u.email === email)) {
                setIsLoading(false);
                return false;
            }

            // Add new user (don't auto-login)
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('visionix_users', JSON.stringify(users));

            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('visionix_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            register,
            logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
