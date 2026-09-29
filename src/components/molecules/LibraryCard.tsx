import ILibrary from "@/interfaces/ILibrary"
import IRelease from "@/interfaces/IRelease"
import { faChevronRight, faCircleCheck, faCircleXmark, faForward, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton, Stack, Typography } from "@mui/material"
import Image from "next/image"

export const LibraryCard = ({ type, time, item, queue, onToggleQueue, onToggleHistory }:
    {
        type: string
        time: string
        item: ILibrary,
        queue: ILibrary[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {

    const remainingAlbumTracks = queue.filter(
        (q) => (q.release.albumId || q.release.spotifyId) === (item.release.albumId || item.release.spotifyId)
    ).length;

    return (
        <Stack
            spacing={2}
            direction="row"
            bgcolor="background.paper"
            sx={{
                position: 'relative',
                cursor: 'pointer',
                opacity: type === 'queue' ? '100%' : '20%',
                '&:hover': {
                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Stack position="relative">
                {item.release.imageUrl &&
                    <Stack
                        sx={{
                            position: 'relative',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            borderRadius: '10px 10px 0 0',
                        }}
                    >
                        <Image src={item.release.imageUrl} alt={item.release.title} width={130} height={130} />
                    </Stack>
                }

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

            <Stack direction="row" justifyContent="space-between" padding="10px 0px 10px 0px" width="100%" minWidth={0}>
                <Stack justifyContent="space-between" minWidth={0}>
                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        border="1px solid"
                        borderColor="text.primary"
                        borderRadius="30px"
                        padding="5px"
                    >
                        {item.release.album ? <Typography variant="body2" noWrap>
                            {item.release.album.title}
                        </Typography> : <Typography variant="body2" noWrap>
                            {item.release.title}
                        </Typography>
                        }

                        <FontAwesomeIcon icon={faChevronRight} />
                    </Stack>

                    <Stack spacing={1}>
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography variant="caption" noWrap>
                                {item.release.title}
                            </Typography>

                            {remainingAlbumTracks > 1 && <Typography variant='caption'>
                                +{remainingAlbumTracks}
                            </Typography>}
                        </Stack>

                        <Typography variant="body2" noWrap>
                            {item.release.artist.name}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" flexShrink={0}>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleQueue(item.release);
                        }}
                        sx={{
                            display: type === 'queue' ? 'flex' : 'none',
                            color: "text.secondary",
                            width: '50px',
                            height: '50px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'primary.main',
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faForward}
                            style={{
                                width: '20px',
                                height: '20px'
                            }} />
                    </IconButton>

                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleHistory(item.release);
                        }}
                        sx={{
                            color: "text.secondary",
                            width: '50px',
                            height: '50px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'primary.main',
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            icon={type === 'queue' ? faCircleCheck : faCircleXmark}
                            style={{
                                width: '30px',
                                height: '30px'
                            }} />
                    </IconButton>
                </Stack>
            </Stack>
        </Stack>
    )
}