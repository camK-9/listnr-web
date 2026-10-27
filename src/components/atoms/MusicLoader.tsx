import React from 'react';
import { Stack } from '@mui/material';
import { keyframes } from '@emotion/react';

export const MusicLoader = () => {
    const pulse = keyframes`0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); }`;
    const spin = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;

    return (
        <Stack
            spacing={3}
            direction="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            py={6}
        >
            <Stack
                width={200}
                height={200}
                borderRadius="50%"
                bgcolor="background.paper"
                position="relative"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 8px 24px rgba(0,0,0,0.2)"
                border="4px solid"
                borderColor="background.default"
                sx={{
                    animation: `${spin} 2s linear infinite`,
                    backgroundImage: `
                        linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.18) 100%),
                        radial-gradient(circle, transparent 35%, rgba(255,255,255,0.08) 36%, transparent 37%),
                        radial-gradient(circle, transparent 55%, rgba(255,255,255,0.08) 56%, transparent 57%),
                        radial-gradient(circle, transparent 75%, rgba(255,255,255,0.08) 76%, transparent 77%)
                    `,
                }}
            >
                <Stack
                    width={200 * 0.35}
                    height={200 * 0.35}
                    borderRadius="50%"
                    bgcolor="primary.main"
                    border="2px solid"
                    borderColor="background.paper"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Stack
                        width={200 * 0.08}
                        height={200 * 0.08}
                        borderRadius="50%"
                        bgcolor="background.default"
                    />
                </Stack>
            </Stack>

            <Stack direction="row" spacing={0.6} alignItems="flex-end" sx={{ height: '24px' }}>
                {
                    [0.2, 0.5, 0.8, 0.4, 0.9, 0.3].map((delay, index) => (
                        <Stack
                            key={index}
                            width="4px"
                            height="24px"
                            bgcolor="primary.main"
                            borderRadius="2px"
                            sx={{
                                animation: `${pulse} 1s ease-in-out infinite`,
                                animationDelay: `${delay}s`,
                            }}
                        />
                    ))
                }
            </Stack>
        </Stack>
    );
}