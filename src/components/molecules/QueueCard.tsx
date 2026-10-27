import { Card, CardMedia, CardContent, Typography, IconButton, Stack, CardActions, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import ILibrary from '@/interfaces/ILibrary';
import IRelease from '@/interfaces/IRelease';

export const QueueCard = ({ item, queue, onToggleQueue, onToggleHistory }:
    {
        item: ILibrary,
        queue: ILibrary[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {

    const remainingAlbumTracks = queue.filter(
        (q) => (q.release.albumId || q.release.spotifyId) === (item.release.albumId || item.release.spotifyId)
    ).length;

    return (
        <Card
            sx={{
                position: 'relative',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                borderRadius: '15px',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Stack position="relative" pt="100%">
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
                <Stack>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography variant='caption' noWrap fontWeight="bold">
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
                <Button
                    variant='contained'
                    onClick={() => onToggleHistory(item.release)}
                    sx={{ borderRadius: '15px' }}
                >
                    Écouté
                </Button>

                <Button
                    variant='outlined'
                    onClick={() => onToggleQueue(item.release)}
                    sx={{ borderRadius: '15px', whiteSpace: 'noWrap' }}
                >
                    Passer
                </Button>
            </CardActions>
        </Card>
    );
};