import { Stack, Link, Divider, Typography, Button } from '@mui/material';
import { faSpotify, faGoogle } from '@fortawesome/free-brands-svg-icons';
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
                <Typography variant="body1" color="text.secondary">
                    OU
                </Typography>
            </Divider>

            <Button
                fullWidth
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                onClick={() => handleSocialLogin('google')}
                sx={{
                    bgcolor: 'action.hover',
                    color: 'background.default',
                    borderRadius: '30px'
                }}
            >
                {mode == "login" ? "Se connecter" : "S'inscrire"} avec Google
            </Button>

            <Button
                fullWidth
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faSpotify} />}
                onClick={() => handleSocialLogin('spotify')}
                sx={{
                    bgcolor: 'success.main',
                    color: 'background.default',
                    borderRadius: '30px'
                }}
            >
                {mode == "login" ? "Se connecter" : "S'inscrire"} avec Spotify
            </Button>

            <Typography textAlign="center">
                {mode == "login" ? "Pas encore de compte ?" :
                    "Déjà un compte ?"} <Link href={`/${mode == "login" ? "register" : "login"}`}>
                    {mode == "login" ? "S'inscrire" : "Se connecter"}
                </Link>
            </Typography>
        </Stack>
    )
};