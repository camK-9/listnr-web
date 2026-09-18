import { Card, CardMedia, CardContent, Typography, IconButton, Stack, CardActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import theme from '@/theme/theme';
import { LoadingButton } from '../atoms/LoadingButton';
import IListenQueue from '@/interfaces/IListenQueue';
import IListenHistory from '@/interfaces/IListenHistory';
import IRelease from '@/interfaces/IRelease';

export const QueueCard = ({ item, queue, history, onToggleQueue, onToggleHistory }:
    {
        item: IListenQueue,
        queue: IListenQueue[],
        history: IListenHistory[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {

    const remainingAlbumTracks = queue.filter((q) => {
        if (item.release?.spotifyUrl && q.release?.spotifyUrl) {
            return q.release?.spotifyUrl === item.release?.spotifyUrl;
        }

        return (
            q.release?.imageUrl === item.release?.imageUrl &&
            q.release.artist?.name === item.release.artist?.name
        );
    }).length;

    const handlePass = async () => {
        onToggleQueue(item.release);
    };

    const handleListened = async () => {
        onToggleHistory(item.release);
    };

    return (
        <Card
            sx={{
                position: 'relative',
                cursor: 'pointer',
                background: theme.palette.background.paper,
                borderRadius: '15px',
                '&:hover': {
                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Stack sx={{ position: 'relative', pt: '100%' }}>
                <CardMedia
                    component="img"
                    image={item.release.imageUrl}
                    alt={item.release.title}
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
                        background: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        opacity: 0,
                        transform: 'translateY(8px)',
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: theme.palette.primary.dark, transform: 'scale(1.05)' },
                    }}
                >
                    <FontAwesomeIcon icon={faPlay} style={{ fontSize: '10px' }} />
                </IconButton>
            </Stack>

            <CardContent>
                <Stack>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography variant='caption' noWrap sx={{ fontWeight: 'bold' }}>
                            {item.release.title}
                        </Typography>

                        {remainingAlbumTracks > 1 && <Typography variant='caption'>
                            +{remainingAlbumTracks}
                        </Typography>}
                    </Stack>
                    <Typography variant="caption" noWrap>
                        {item.release.artist.name}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions>
                <LoadingButton
                    variant='contained'
                    onClick={handleListened}
                    sx={{
                        borderRadius: '15px'
                    }}
                >
                    Écouté
                </LoadingButton>

                <LoadingButton
                    variant='outlined'
                    onClick={handlePass}
                    sx={{
                        borderRadius: '15px',
                        whiteSpace: 'noWrap'
                    }}
                >
                    Passer
                </LoadingButton>
            </CardActions>
        </Card>
    );
};