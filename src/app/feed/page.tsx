'use client';

import { MusicLoader } from "@/components/atoms/MusicLoader";
import { PopularArtists } from "@/components/molecules/PouplarArtists";
import { PopularUsers } from "@/components/molecules/PouplarUsers";
import { ReviewCard } from "@/components/molecules/ReviewCard";
import IArtist from "@/interfaces/IArtist";
import IReview from "@/interfaces/IReview";
import IUser from "@/interfaces/IUser";
import { artistService } from "@/lib/artistService";
import { feedService } from "@/lib/feedService";
import { userService } from "@/lib/userService";
import theme from "@/theme/theme";
import { Alert, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";

export default function FeedPage() {
    const [feed, setFeed] = useState<IReview[]>([]);
    const [usersPopular, setUsersPopular] = useState<IUser[]>([]);
    const [artistsPopular, setArtistsPopular] = useState<IArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const [feedData, usersPopularData, artistsPopularData] = await Promise.all([
                    feedService.getFeedService(1, 10),
                    userService.getPopularUsers(),
                    artistService.getPopularArtists(),
                ]);

                setFeed(feedData);
                setUsersPopular(usersPopularData);
                setArtistsPopular(artistsPopularData);

                if (feedData.length < 10) {
                    setHasMore(false);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Impossible de charger le fil d’actualité');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
                !loadingMore &&
                hasMore
            ) {
                loadMoreFeed();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, page]);

    const loadMoreFeed = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const moreFeedData = await feedService.getFeedService(nextPage, 10);

            if (moreFeedData.length < 10) {
                setHasMore(false);
            }

            setFeed((prevFeed) => [...prevFeed, ...moreFeedData]);
            setPage(nextPage);
        } catch (err) {
            console.error("Erreur lors du chargement de la suite du feed", err);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <Stack spacing={4}>
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}
            {loading ? <MusicLoader /> : <Stack spacing={8} direction="row" justifyContent="space-between">
                <Stack spacing={4} width="100%" maxWidth="600px">
                    <Stack justifyContent="center" height="30px">
                        <Typography variant="h2">
                            Reviews récentes
                        </Typography>
                    </Stack>

                    {feed.map((item: IReview) => (
                        <ReviewCard key={item.id} {...item} />
                    ))}
                </Stack>

                <Stack spacing={8} display={isMobile ? 'none' : 'flex'} flex="0 1 350px" minWidth="275px">
                    <Stack spacing={4}>
                        <Stack justifyContent="center" height="30px">
                            <Typography variant="body2">
                                Membres actifs
                            </Typography>
                        </Stack>

                        {usersPopular.slice(0, 10).map((item: IUser) => (
                            <Stack
                                key={item.id}
                                spacing={2}
                            >
                                <PopularUsers {...item} />

                                <Stack alignItems="center">
                                    <Divider sx={{ width: '80%' }} />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>

                    <Stack spacing={4} display={isMobile ? 'none' : 'flex'}>
                        <Stack justifyContent="center" height="30px">
                            <Typography variant="body2">
                                Artistes populaire
                            </Typography>
                        </Stack>

                        {artistsPopular.slice(0, 10).map((item: IArtist) => (
                            <Stack
                                key={item.id}
                                spacing={2}
                            >
                                <PopularArtists {...item} />

                                <Stack alignItems="center">
                                    <Divider sx={{ width: '80%' }} />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Stack>}
        </Stack>
    )
}