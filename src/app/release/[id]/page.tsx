'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Stack, IconButton, Rating, Accordion, AccordionSummary, AccordionDetails, useMediaQuery } from '@mui/material';
import { releaseService } from '@/lib/releaseService';
import IRelease from '@/interfaces/IRelease';
import Image from 'next/image';
import { faChevronDown, faCircleCheck, faCircleXmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { libraryService } from '@/lib/libraryService';
import { ReviewCard } from '@/components/molecules/ReviewCard';
import theme from '@/theme/theme';
import { ReleaseActions } from '@/components/organisms/ReleaseActions';
import { reviewService } from '@/lib/reviewService';
import IReview from '@/interfaces/IReview';
import { MusicLoader } from '@/components/atoms/MusicLoader';

export default function ReleasePage() {
    const params = useParams();
    const id = params.id as string;

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [review, setReview] = useState<IReview>();
    const [release, setRelease] = useState<IRelease>();
    const [tracks, setTracks] = useState<IRelease[]>([]);
    const [listenedTracks, setListenedTracks] = useState<number>();
    const [totalDuration, setTotalDuration] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [releaseData, reviewData] = await Promise.all([
                    releaseService.getStats(id),
                    reviewService.getReviewByRelease(id)
                ]);

                setRelease(releaseData);
                setReview(reviewData[0])

                if (releaseData?.type === 'ALBUM') {
                    const tracksData = await releaseService.getTracks(id);
                    setTracks(tracksData);

                    const totalMs = tracksData.reduce((acc: number, track: any) => acc + (track.durationMs || 0), 0);
                    setTotalDuration(formatTime(totalMs));
                } else {
                    setTracks([]);
                    setTotalDuration('');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la release', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (tracks.length === 0) return;

        setListenedTracks(tracks.filter((track) => track.isInHistory).length);

        const hasAnyTrackListened = tracks.some((track) => track.isInHistory);

        setRelease((prev) => {
            if (!prev) return prev;
            if (prev.isInHistory !== hasAnyTrackListened) {
                return {
                    ...prev,
                    isInHistory: hasAnyTrackListened,
                    isInQueue: !hasAnyTrackListened
                };
            }
            return prev;
        });
    }, [tracks]);

    const handleToggleQueue = async (releaseItem: IRelease) => {
        try {
            await libraryService.toggleQueue(releaseItem.spotifyId);

            setRelease((prev) => {
                if (!prev) return prev;
                const newIsInQueue = !prev.isInQueue;

                return {
                    ...prev,
                    isInQueue: newIsInQueue,
                };
            });
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la queue', err);
        }
    };

    const handleToggleHistory = async (releaseItem: IRelease, type: string) => {
        try {
            await libraryService.toggleHistory(releaseItem.spotifyId);

            if (type === "track") {
                setTracks((prev) =>
                    prev.map((t) =>
                        t.spotifyId === releaseItem.spotifyId
                            ? { ...t, isInHistory: !t.isInHistory }
                            : t
                    )
                );
            } else {
                setRelease((prev) => {
                    if (!prev) return prev;
                    const newIsInHistory = !prev.isInHistory;

                    setTracks((prevTracks) =>
                        prevTracks.map((t) => ({
                            ...t,
                            isInHistory: newIsInHistory,
                        }))
                    );

                    return {
                        ...prev,
                        isInHistory: newIsInHistory,
                        isInQueue: !newIsInHistory
                    };
                });
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'historique :", err);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    const formatTime = (ms: number) => {
        if (!ms) return '';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours} h ${minutes % 60} min`;
        }
        return `${minutes} min`;
    };

    const formatDuration = (ms: number) => {
        if (!ms) return '0:00';

        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${paddedMinutes}:${paddedSeconds}`;
        }

        return `${minutes}:${paddedSeconds}`;
    };

    const formatCount = (count: number) => {
        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return count.toString();
    };

    return (
        <Stack spacing={4} direction={isMobile ? "column" : "row"} mt="50px">
            {loading ? <MusicLoader /> : release && release.stats && <Stack spacing={4} width="100%">
                <Stack spacing={2} direction={isMobile ? "column" : "row"}>
                    <Stack spacing={2} direction="row">
                        <Stack
                            position="relative"
                            sx={{
                                transition: 'transform 0.2s ease, background-color 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    '& .play-button': { opacity: 1, transform: 'translateY(0)' },
                                }
                            }}
                        >
                            {release.imageUrl &&
                                <Stack
                                    position="relative"
                                    top={0}
                                    left={0}
                                    borderRadius="10px 10px 0 0"
                                    sx={{ objectFit: 'cover' }}
                                >
                                    <Image src={release.imageUrl} alt={release.title} width={175} height={175} />
                                </Stack>
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

                        <Stack spacing={1} justifyContent="space-between">
                            <Stack spacing={1}>
                                <Typography variant='h2'>
                                    {release.title}
                                </Typography>

                                <Typography variant='body2'>
                                    {release.artist.name}
                                </Typography>

                                <Typography variant='caption' color="text.secondary">
                                    {release.totalTracks} {release.totalTracks === "1" ? "titre" :
                                        "titres"} • {tracks.length > 1 && `${totalDuration} •`} {formatDate(release.releaseDate)}
                                </Typography>
                            </Stack>

                            <Stack spacing={1}>
                                <Stack spacing={1} direction="row" alignItems="center">
                                    <Rating
                                        readOnly
                                        defaultValue={release.stats.averageRating}
                                        precision={0.5}
                                        size="small"
                                        sx={{ color: 'primary.main' }}
                                    />

                                    <Typography variant='caption'>
                                        {release.stats.averageRating}
                                    </Typography>
                                </Stack>

                                <Typography variant='caption' fontWeight="bold">
                                    {formatCount(release.stats.totalListeners)} {release.stats.totalListeners > 1 ?
                                        "personnes ont écoutés" : "personne à écouté"}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    {isMobile && release && review && release.stats && <ReleaseActions
                        release={release}
                        review={review}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />}
                </Stack>

                {tracks.length > 1 && <Stack spacing={1}>
                    <Typography variant='body2'>
                        Listes des musiques
                    </Typography>

                    <Stack>
                        <Accordion disableGutters>
                            <AccordionSummary
                                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                                sx={{
                                    flexDirection: 'row-reverse',
                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                        mr: '10px',
                                    },
                                    '&.Mui-expanded': {
                                        borderBottom: '3px solid',
                                        borderColor: 'text.secondary',
                                    },
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                                    <Typography variant='caption'>
                                        {release.title}
                                    </Typography>

                                    <Stack spacing={1} direction="row" alignItems="center">
                                        <Typography variant='caption' color="text.secondary">
                                            {listenedTracks} / {release.totalTracks}
                                        </Typography>

                                        <Stack
                                            component="span"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleHistory(release, 'album');
                                            }}
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            width="50px"
                                            height="50px"
                                            borderRadius="50px"
                                            sx={{
                                                cursor: 'pointer',
                                                color: release.isInHistory ? 'primary.main' : 'text.secondary',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    bgcolor: 'divider',
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={release.isInHistory ? faCircleXmark : faCircleCheck}
                                                style={{
                                                    width: '30px',
                                                    height: '30px'
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: 0 }}>
                                <Stack spacing={2}>
                                    {tracks.map((track) => (
                                        <Stack
                                            key={track.spotifyId}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p="15px"
                                            borderBottom="1px solid"
                                            borderColor="text.secondary"
                                        >
                                            <Stack spacing={1}>
                                                <Typography variant="caption">
                                                    {track.trackNumber}. {track.title}
                                                </Typography>
                                                {track.durationMs && <Typography variant="caption" color='text.secondary'>
                                                    {formatDuration(track.durationMs)}
                                                </Typography>}
                                            </Stack>

                                            <IconButton
                                                onClick={() => handleToggleHistory(track, 'track')}
                                                sx={{
                                                    color: track.isInHistory ? 'primary.main' : 'text.secondary',
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50px',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={track.isInHistory ? faCircleXmark : faCircleCheck}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px'
                                                    }}
                                                />
                                            </IconButton>
                                        </Stack>
                                    ))}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Stack>}

                <Stack spacing={2}>
                    <Typography>
                        Reviews récentes
                    </Typography>

                    {release.recentReviews && release.recentReviews?.length > 0 ? release.recentReviews.map((review) =>
                        <ReviewCard key={review.id} {...review} />
                    ) : <Stack
                        alignItems="center"
                        justifyContent="center"
                        p="20px"
                        border="1px dashed"
                        borderColor="text.secondary"
                        borderRadius="5px"
                    >
                        <Typography variant="caption" color="text.secondary">
                            Aucune review postée pour le moment
                        </Typography>
                    </Stack>}
                </Stack>
            </Stack>}

            {!isMobile && release && review && release.stats && <ReleaseActions
                release={release}
                review={review}
                onToggleQueue={handleToggleQueue}
                onToggleHistory={handleToggleHistory}
            />}
        </Stack>
    );
}