import { Container, Typography, Stack } from '@mui/material';
import { RegisterForm } from '@/components/organisms/RegisterForm';

export default function RegisterPage() {
    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: '50px' }}>
            <Stack spacing={4} alignItems="center">
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h1">
                        Bienvenue
                    </Typography>

                    <Typography variant="body1" textAlign="center">
                        Créez un compte et <br />
                        rejoignez la communauté de Listnr !
                    </Typography>
                </Stack>

                <RegisterForm />
            </Stack>
        </Container>
    );
}