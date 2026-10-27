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

export const SearchCard = ({ release, artist, user, onToggleQueue, onToggleHistory }:
    {
        release?: IRelease,
        artist?: IArtist,
        user?: IUser,
        onToggleQueue: (release: IRelease) => void
        onToggleHistory: (release: IRelease) => void
    }) => {
    const router = useRouter();

    const [isFollowing, setIsFollowing] = useState<Boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {
        const targetId = artist?.spotifyId || user?.id;
        if (!targetId) return;

        setLoading(true);
        try {
            if (artist && artist.spotifyId) {
                const data = await artistService.toggleFollow(targetId);
                setIsFollowing(data.isFollowing);
            } else {
                const data = await userService.toggleFollow(targetId);
                setIsFollowing(data.isFollowing);
            }
        } catch (error) {
            console.error("Erreur lors de l'action follow/unfollow", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = () => {
        if (release) {
            router.push(`/release/${release.spotifyId}`)
        } else if (artist) {
            router.push(`/artist/${artist.spotifyId}`)
        } else if (user) {
            router.push(`/user/${user.id}`)
        } else {
            router.push(window.location.href)
        }
    };

    const title = release?.title || artist?.name || user?.username;
    const subtitle = release?.artist?.name || artist?.stats?.followersCount || user?.stats?.followersCount;
    const imageUrl = release?.imageUrl || artist?.imageUrl || user?.avatarUrl;

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
            {imageUrl ? release ? <Stack position="relative">
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
            </Stack> : <Avatar src={imageUrl} alt={title || ''} sx={{ width: 100, height: 100 }} /> :
                <Avatar sx={{ width: 100, height: 100 }}>{title?.[0]}</Avatar>}

            <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                onClick={handleRedirect}
            >
                <Stack spacing={2}>
                    <Typography variant='body2'>
                        {title}
                    </Typography>

                    <Typography variant='caption'>
                        {subtitle}
                    </Typography>
                </Stack>

                {release ? <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
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
                </Stack> :
                    <Tooltip
                        title={isFollowing ? 'Ne plus suivre' : 'Suivre'}
                        slots={{ transition: Zoom }}
                    >
                        <IconButton
                            disabled={loading}
                            onClick={handleFollow}
                            sx={{
                                color: isFollowing ? 'primary.main' : 'text.secondary',
                                '&:hover': {
                                    color: isFollowing ? 'error.main' : 'primary.main',
                                },
                            }}
                        >
                            <FontAwesomeIcon
                                icon={isFollowing ? faUserMinus : faUserPlus}
                                style={{ width: '25px', height: '25px' }}
                            />
                        </IconButton>
                    </Tooltip>}
            </Stack>
        </Stack >
    );
};