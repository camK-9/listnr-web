'use client';

import React, { useState } from 'react';
import { Alert, Stack, Link, Checkbox, Typography } from '@mui/material';
import { authService } from '@/lib/authService';
import { LoadingButton } from '../atoms/LoadingButton';
import { useRouter } from 'next/navigation';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppTextField } from '../molecules/AppTextField';
import { SocialButtons } from '../molecules/SocialButtons';

export const RegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        if (!acceptedTerms) {
            setError("Vous devez accepter les conditions d'utilisation");
            setLoading(false);
            return;
        }

        try {
            await authService.register({ email, username, password });
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription");
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
                    id="username"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    autoFocus
                    icon={faUser}
                />

                <AppTextField
                    required
                    id="email"
                    name="email"
                    placeholder="Adresse Email"
                    icon={faEnvelope}
                />

                <AppTextField
                    required
                    id="password"
                    name="password"
                    placeholder="Mot de passe"
                    type="password"
                    icon={faLock}
                />

                <AppTextField
                    required
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirmez le mot de passe"
                    type="password"
                    icon={faLock}
                />

                <Stack direction="row" alignItems="center">
                    <Checkbox
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />

                    <Typography>
                        J'accepte les <Link href="/terms">
                            conditions d'utilisations
                        </Link>
                    </Typography>
                </Stack>

                <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    isLoading={loading}
                >
                    S'inscrire
                </LoadingButton>
            </Stack>

            <SocialButtons mode="register" />
        </Stack>
    );
};