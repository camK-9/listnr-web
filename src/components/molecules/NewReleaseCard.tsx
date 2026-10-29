import { Card, CardMedia, CardContent, Typography, IconButton, Stack, CardActions, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import IRelease from '@/interfaces/IRelease';
import { useRouter } from 'next/navigation';

export const NewReleaseCard = ({ item, onToggleQueue, onToggleHistory }:
    {
        item: IRelease,
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {
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
                    image={item.imageUrl}
                    alt={item.title}
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.spotifyUrl, '_blank', 'noopener,noreferrer');
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
                        window.open(item.spotifyUrl, '_blank', 'noopener,noreferrer');
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
                <Stack onClick={() => router.push(`/release/${item.spotifyId}`)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="caption" noWrap fontWeight={700}>
                        {item.title}
                    </Typography>
                    <Typography variant="caption" noWrap>
                        {item.artist.name}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions>
                <Button
                    variant='contained'
                    onClick={() => onToggleHistory(item)}
                    sx={{ borderRadius: '15px' }}
                >
                    {item.isInHistory ? "Pas écouté" : "Écouté"}
                </Button>

                {!item.isInHistory && <Button
                    variant='outlined'
                    onClick={() => onToggleQueue(item)}
                    sx={{ borderRadius: '15px', whiteSpace: 'noWrap' }}
                >
                    {item.isInQueue ? "Retirer" : "Plus tard"}
                </Button>}
            </CardActions>
        </Card>
    );
};