'use client';

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
import { Alert, CircularProgress, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";

export default function FeedPage() {
    const [feed, setFeed] = useState<IReview[]>([]);
    const [usersPopular, setUsersPopular] = useState<IUser[]>([]);
    const [artistsPopular, setArtistsPopular] = useState<IArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const [feedData, usersPopularData, artistsPopularData] = await Promise.all([
                    feedService.getFeedService(),
                    userService.getPopularUsers(),
                    artistService.getPopularArtists(),
                ]);

                setFeed(feedData);
                setUsersPopular(usersPopularData);
                setArtistsPopular(artistsPopularData);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Impossible de charger le fil d’actualité');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    return (
        <Stack spacing={4}>
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}
            {loading ? <Stack>
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Stack> : <Stack spacing={4} direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
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

                <Stack spacing={8} sx={{ display: isMobile ? 'none' : 'flex', flex: '0 1 350px', minWidth: '275px' }}>
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

                    <Stack spacing={4} sx={{ display: isMobile ? 'none' : 'flex', flex: '0 1 350px', minWidth: '275px' }}>
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