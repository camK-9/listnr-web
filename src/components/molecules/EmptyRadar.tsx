'use client';

import { Paper, Typography, Button, Stack, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faRadio } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import theme from '@/theme/theme';
import { LoadingButton } from '../atoms/LoadingButton';

export const EmptyRadar = () => {
    const router = useRouter();

    return (
        <Stack
            spacing={2}
            alignItems="center"
            sx={{
                padding: '50px',
                textAlign: 'center',
                borderRadius: '16px',
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            <Stack
                sx={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '60px',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                }}
            >
                <FontAwesomeIcon icon={faRadio} size="2x" />
            </Stack>

            <Typography variant="h2" fontWeight="bold">
                Rien sur le radar !
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px' }}>
                Tu es totalement à jour. Explore les sorties récentes pour ajouter de nouveaux projets à ta file d'attente.
            </Typography>

            <LoadingButton
                variant="contained"
                onClick={() => router.push('/search')}
                startIcon={<FontAwesomeIcon icon={faCompass} />}
            >
                Explorer les nouveautés
            </LoadingButton>
        </Stack>
    );
};