import { Stack, Link, Divider, Typography } from '@mui/material';
import { LoadingButton } from '../atoms/LoadingButton';
import { faSpotify, faGoogle } from '@fortawesome/free-brands-svg-icons';
import theme from '@/theme/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SocialLoginButtonsProps {
    mode: 'login' | 'register';
}

export const SocialButtons = ({ mode }: SocialLoginButtonsProps) => {
    const handleSocialLogin = (provider: 'google' | 'spotify') => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}?mode=${mode}`;
    };

    return (
        <Stack spacing={2}>
            <Divider>
                <Typography variant="body1" color={theme.palette.text.secondary}>
                    OU
                </Typography>
            </Divider>

            <LoadingButton
                fullWidth
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                onClick={() => handleSocialLogin('google')}
                sx={{
                    background: theme.palette.action.hover,
                    color: theme.palette.background.default,
                }}
            >
                {mode == "login" ? "Se connecter" : "S'inscrire"} avec Google
            </LoadingButton>

            <LoadingButton
                fullWidth
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faSpotify} />}
                onClick={() => handleSocialLogin('spotify')}
                sx={{
                    background: theme.palette.success.main,
                    color: theme.palette.background.default,
                }}
            >
                {mode == "login" ? "Se connecter" : "S'inscrire"} avec Spotify
            </LoadingButton>

            <Typography textAlign="center">
                {mode == "login" ? "Pas encore de compte ?" :
                    "Déjà un compte ?"} <Link href={`/${mode == "login" ? "register" : "login"}`}>
                    {mode == "login" ? "S'inscrire" : "Se connecter"}
                </Link>
            </Typography>
        </Stack>
    )
};