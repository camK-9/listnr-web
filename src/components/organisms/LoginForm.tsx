'use client';

import React, { useState } from 'react';
import { Alert, Stack, Link } from '@mui/material';
import { authService } from '@/lib/authService';
import { LoadingButton } from '../atoms/LoadingButton';
import { useRouter } from 'next/navigation';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AppTextField } from '../molecules/AppTextField';
import { SocialButtons } from '../molecules/SocialButtons';
import { useAuth } from '@/context/AuthContext';

export const LoginForm = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const data = await authService.login({ email, password });
            login(data.access_token, data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Identifiants invalides');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={4} width="100%">
            <Stack
                component="form"
                onSubmit={handleSubmit}
                noValidate
                spacing={2}
            >
                {error && <Alert severity="error">{error}</Alert>}

                <AppTextField
                    required
                    id="email"
                    name="email"
                    placeholder="Adresse Email"
                    autoComplete="email"
                    autoFocus
                    icon={faEnvelope}
                />

                <AppTextField
                    required
                    id="password"
                    name="password"
                    placeholder="Mot de passe"
                    type="password"
                    autoComplete="current-password"
                    icon={faLock}
                />

                <Link href="/forgot-password" textAlign="end">
                    Mot de passe oublié ?
                </Link>

                <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    isLoading={loading}
                >
                    Se connecter
                </LoadingButton>
            </Stack>

            <SocialButtons mode="login" />
        </Stack>
    );
};