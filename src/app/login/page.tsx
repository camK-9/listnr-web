import { Container, Typography, Stack } from '@mui/material';
import { LoginForm } from '@/components/organisms/LoginForm';

export default function LoginPage() {
    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: '50px' }}>
            <Stack spacing={4} alignItems="center">
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h1">
                        Bienvenue
                    </Typography>

                    <Typography variant="body1" textAlign="center">
                        Connectez vous et <br />
                        profitez des fonctionnalités de Listnr !
                    </Typography>
                </Stack>

                <LoginForm />
            </Stack>
        </Container>
    );
}