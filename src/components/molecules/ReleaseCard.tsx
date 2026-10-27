import IArtist from '@/interfaces/IArtist';
import IRelease from '@/interfaces/IRelease';
import IUser from '@/interfaces/IUser';
import { artistService } from '@/lib/artistService';
import { libraryService } from '@/lib/libraryService';
import { releaseService } from '@/lib/releaseService';
import { userService } from '@/lib/userService';
import { faCircleCheck, faCircleMinus, faCirclePlus, faCircleXmark, faPlay, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ReleaseCard = ({ release, onToggleQueue, onToggleHistory }:
    {
        release: IRelease,
        onToggleQueue: (release: IRelease) => void
        onToggleHistory: (release: IRelease) => void
    }) => {
    const router = useRouter();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    return (
        <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            position="relative"
            bgcolor="background.paper"
            p="10px"
            borderRadius="15px"
            maxWidth="800px"
            width="100%"
            sx={{
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Stack position="relative">
                {release.imageUrl &&
                    <Image
                        src={release.imageUrl}
                        alt={release.title}
                        width={100}
                        height={100}
                        style={{
                            position: 'relative',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            borderRadius: '15px'
                        }}
                    />
                }

                <IconButton
                    className="play-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(release.spotifyUrl, '_blank', 'noopener,noreferrer');
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

            <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                onClick={() => router.push(`/release/${release.spotifyId}`)}
            >
                <Stack spacing={2}>
                    <Typography variant='body2'>
                        {release.title}
                    </Typography>

                    <Typography variant='caption' color='text.secondary'>
                        {formatDate(release.releaseDate)}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                    <Tooltip
                        title={release.isInQueue ? "Retirer de la file d'attente" : "Ajouter à la file d'attente"}
                        slots={{ transition: Zoom }}
                    >
                        <IconButton
                            onClick={() => onToggleQueue(release)}
                            sx={{
                                color: release.isInQueue ? 'primary.main' : 'text.secondary',
                                '&:hover': {
                                    color: release.isInQueue ? 'error.main' : 'primary.main',
                                },
                            }}
                        >
                            <FontAwesomeIcon
                                icon={release.isInQueue ? faCircleMinus : faCirclePlus}
                                style={{ width: '30px', height: '30px' }}
                            />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={release.isInHistory ? "Retirer de l'historique" : "Marquer comme écouté"}
                        slots={{ transition: Zoom }}
                    >
                        <IconButton
                            onClick={() => onToggleHistory(release)}
                            sx={{
                                color: release.isInHistory ? 'primary.main' : 'text.secondary',
                                '&:hover': {
                                    color: release.isInHistory ? 'error.main' : 'primary.main',
                                },
                            }}
                        >
                            <FontAwesomeIcon
                                icon={release.isInHistory ? faCircleXmark : faCircleCheck}
                                style={{ width: '30px', height: '30px' }}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        </Stack >
    );
};