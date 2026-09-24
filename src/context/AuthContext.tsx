'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import IUser from '@/interfaces/IUser';
import { userService } from '@/lib/userService';

interface AuthContextType {
    user: IUser | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await userService.getProfile();
            setUser(data);
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
            logout();
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('token');

            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUser();
            }
            setIsLoading(false);
        };

        initAuth();
    }, [fetchUser]);

    const login = async (token: string) => {
        Cookies.set('token', token, { expires: 7 });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser();
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser: fetchUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};