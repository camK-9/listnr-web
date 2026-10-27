'use client';

import React from 'react';
import { Typography, Stack, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function Custom404() {
    const router = useRouter();

    return (
        <Stack
            spacing={3}
            direction="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
            textAlign="center"
            py={4}
        >
            <Stack
                width={100}
                height={100}
                borderRadius="50%"
                bgcolor="background.paper"
                alignItems="center"
                justifyContent="center"
                boxShadow={3}
                color="primary.main"
                fontSize="40px"
            >
                <FontAwesomeIcon icon={faCompactDisc} spin style={{ animationDuration: '6s' }} />
            </Stack>

            <Typography
                variant="h1"
                fontWeight={800}
                fontSize={{ xs: '5rem', md: '7rem' }}
                lineHeight={1}
                sx={{
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                404
            </Typography>

            <Stack spacing={1}>
                <Typography variant="h2">
                    Oups ! Ce morceau est introuvable.
                </Typography>
                <Typography variant="body2" color="text.secondary" maxWidth="450px">
                    La piste que tu cherches a peut-être été supprimée, déplacée, ou le disque s'est rayé en route.
                </Typography>
            </Stack>

            <Button
                variant="contained"
                size="small"
                startIcon={<FontAwesomeIcon icon={faHouse} />}
                onClick={() => router.push('/')}
                sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: 2
                }}
            >
                Retourner à l'accueil
            </Button>
        </Stack>
    );
}