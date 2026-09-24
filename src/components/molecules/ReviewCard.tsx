import React from 'react';
import { Avatar, Divider, Rating, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faComment, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import IReview from '@/interfaces/IReview';
import Image from 'next/image';

export const ReviewCard = (item: IReview) => {
    return (
        <Stack
            spacing={2}
            sx={{
                position: 'relative',
                cursor: 'pointer',
                padding: '20px',
                bgcolor: 'background.paper',
                borderRadius: '15px'
            }}
        >
            <Stack spacing={1} direction="row" alignItems="center">
                <Avatar
                    src={item.user.avatarUrl}
                    alt={item.user.username}
                    sx={{ width: 30, height: 30, fontWeight: 600 }}
                >
                    {item.user.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant='caption' color="text.secondary">
                    {item.user.username}
                </Typography>
            </Stack>

            <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant='body1' noWrap>
                    {item.release.title} - {item.release.artist.name}
                </Typography>

                <Typography variant='caption' color="text.secondary">
                    {item.release.releaseDate.slice(0, 4)}
                </Typography>
            </Stack>

            <Rating
                readOnly
                defaultValue={item.rating}
                precision={0.5}
                size="small"
                sx={{ color: 'primary.main' }}
            />

            <Stack spacing={1} direction="row">
                {item.release.imageUrl &&
                    <Image src={item.release.imageUrl} alt={item.release.title} width={100} height={100} />
                }

                <Typography
                    variant='caption'
                    sx={{
                        maxHeight: '100px',
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {item.comment}
                </Typography>
            </Stack>

            <Divider />

            <Stack spacing={4} direction="row" alignItems="center">
                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                        color: 'text.secondary',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'action.hover',
                            transform: 'translateY(-4px)',
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faHeart} />

                    <Typography variant='caption'>
                        {item.likes ? item.likes.length : "0"}
                    </Typography>
                </Stack>

                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                        color: 'text.secondary',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'secondary.main',
                            transform: 'translateY(-4px)',
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faComment} />

                    <Typography variant='caption'>
                        {item.comments ? item.comments.length : "0"}
                    </Typography>
                </Stack>

                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                        color: 'text.secondary',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'text.primary',
                            transform: 'translateY(-4px)',
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faShare} />
                </Stack>
            </Stack>
        </Stack >
    );
};