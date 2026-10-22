import React, { useEffect, useState } from 'react';
import { Stack, Rating, TextField, IconButton, useMediaQuery } from '@mui/material';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { reviewService } from '@/lib/reviewService';
import theme from '@/theme/theme';
import IReview from '@/interfaces/IReview';

export const ReviewForm = ({ releaseId, review }: { releaseId: string, review: IReview }) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [rating, setRating] = useState<number | null>(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [loading, setLoading] = useState(false);

    const handleSave = async (newRating: number | null, newComment: string) => {
        setLoading(true);
        try {
            const res = await reviewService.createOrUpdateReview(releaseId, newRating, newComment)

            console.log(res)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la review", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (_: React.SyntheticEvent, newValue: number | null) => {
        setRating(newValue);
        handleSave(newValue, comment ? comment : '');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(rating, comment ? comment : '');
        }
    };

    return (
        <Stack spacing={2}>
            <Rating
                value={rating}
                onChange={handleRatingChange}
                precision={0.5}
                size="large"
                sx={{ color: 'primary.main' }}
            />

            <TextField
                label="Laisser un avis..."
                multiline
                rows={isMobile ? 3 : 5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                fullWidth
                disabled={loading}
                slotProps={{
                    input: {
                        sx: {
                            alignItems: 'flex-start',
                        },
                        endAdornment: (
                            <IconButton
                                color="primary"
                                disabled={loading || !comment}
                                onClick={() => handleSave(rating, comment ? comment : '')}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} style={{ width: '20px', height: '20px' }} />
                            </IconButton>
                        ),
                    }
                }}
            />
        </Stack>
    );
};