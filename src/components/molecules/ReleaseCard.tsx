import { Card, CardMedia, CardContent, Typography, IconButton, Stack, CardActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import theme from '@/theme/theme';
import IRelease from '@/interfaces/IRelease';
import { LoadingButton } from '../atoms/LoadingButton';
import IListenHistory from '@/interfaces/IListenHistory';
import IListenQueue from '@/interfaces/IListenQueue';

export const ReleaseCard = ({ item, queue, history, onToggleQueue, onToggleHistory }:
    {
        item: IRelease,
        queue: IListenQueue[],
        history: IListenHistory[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {

    const isInQueue = queue.some((q) => {
        const isDirectMatch = q.release.spotifyId === item.spotifyId;

        const isTrackOfAlbum = q.release.spotifyUrl?.includes(item.spotifyId);

        return Boolean(isDirectMatch || isTrackOfAlbum);
    });

    const isInHistory = history.some((h) => {
        const isDirectMatch = h.release.spotifyId === item.spotifyId;

        const isTrackOfAlbum = h.release.spotifyUrl?.includes(item.spotifyId);

        return Boolean(isDirectMatch || isTrackOfAlbum);
    });

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
                    image={item.imageUrl}
                    alt={item.title}
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
                        window.open(item.spotifyUrl, '_blank', 'noopener,noreferrer');
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
                    <Typography variant="caption" noWrap sx={{ fontWeight: 'bold' }}>
                        {item.title}
                    </Typography>
                    <Typography variant="caption" noWrap>
                        {item.artist.name}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions>
                <LoadingButton
                    variant='contained'
                    onClick={() => onToggleHistory(item)}
                    sx={{
                        borderRadius: '15px'
                    }}
                >
                    {isInHistory ? "Pas écouté" : "Écouté"}
                </LoadingButton>

                {!isInHistory && <LoadingButton
                    variant='outlined'
                    onClick={() => onToggleQueue(item)}
                    sx={{
                        borderRadius: '15px',
                        whiteSpace: 'noWrap'
                    }}
                >
                    {isInQueue ? "Retirer" : "Plus tard"}
                </LoadingButton>}
            </CardActions>
        </Card>
    );
};