import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Stack, Rating } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import IReview from '@/interfaces/IReview';
import { useRouter } from 'next/navigation';

export const PopularReviewCard = (item: IReview) => {
    const router = useRouter();

    return (
        <Card
            sx={{
                position: 'relative',
                bgcolor: 'background.paper',
                borderRadius: '15px',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Stack position="relative" pt="100%" sx={{ cursor: 'pointer' }}>
                <CardMedia
                    component="img"
                    image={item.release.imageUrl}
                    alt={item.release.title}
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.release.spotifyUrl, '_blank', 'noopener,noreferrer');
                    }}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px 10px 0 0',
                    }}
                />
                <IconButton
                    className="play-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.release.spotifyUrl, '_blank', 'noopener,noreferrer');
                    }}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'primary.main',
                        color: 'text.primary',
                        opacity: 0,
                        transform: 'translateY(8px)',
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.05)' },
                    }}
                >
                    <FontAwesomeIcon icon={faPlay} style={{ fontSize: '10px' }} />
                </IconButton>
            </Stack>

            <CardContent>
                <Stack spacing={1}>
                    <Typography
                        variant="caption"
                        noWrap
                        fontWeight={700}
                        onClick={() => router.push(`/review/${item.id}`)}
                        sx={{ cursor: 'pointer' }}
                    >
                        {item.user.username}
                    </Typography>

                    <Rating
                        readOnly
                        defaultValue={item.rating}
                        precision={0.5}
                        size="small"
                        sx={{ color: 'primary.main' }}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
};