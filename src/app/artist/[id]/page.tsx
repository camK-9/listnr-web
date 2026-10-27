'use client';

import { ReleaseCard } from "@/components/molecules/ReleaseCard";
import IArtist from "@/interfaces/IArtist";
import IRelease from "@/interfaces/IRelease";
import { artistService } from "@/lib/artistService";
import { libraryService } from "@/lib/libraryService";
import { releaseService } from "@/lib/releaseService";
import { Avatar, Button, CircularProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReleasePage() {
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState(0);
    const [artist, setArtist] = useState<IArtist>();
    const [isFollowing, setIsFollowing] = useState<Boolean>(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [releases, setReleases] = useState<IRelease[]>([])

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [artistData, releasesData] = await Promise.all([
                    artistService.getProfile(id),
                    releaseService.getArtistRelases(id)
                ])

                console.log(releasesData)

                setArtist(artistData);
                setIsFollowing(artistData.isFollowing)
                setFollowersCount(artistData.stats.followersCount)
                setReleases(releasesData)
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'artiste", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleFollowClick = async () => {
        try {
            if (artist) {
                const data = await artistService.toggleFollow(artist.spotifyId)
                setIsFollowing(data.isFollowing);
                setFollowersCount((prev) => (data.isFollowing === true ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error("Erreur lors de l'action follow/unfollow", error);
        }
    };

    const handleToggleQueue = async (releaseItem: IRelease) => {
        try {
            await libraryService.toggleQueue(releaseItem.spotifyId);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la queue', err);
        }
    };

    const handleToggleHistory = async (releaseItem: IRelease) => {
        try {
            await libraryService.toggleHistory(releaseItem.spotifyId);
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'historique :", err);
        }
    };

    const sortedReleases = [...releases].sort((a, b) => {
        const dateA = new Date(a.releaseDate || 0).getTime();
        const dateB = new Date(b.releaseDate || 0).getTime();
        return dateB - dateA;
    });

    return (
        <Stack spacing={4} marginTop="50px">
            {loading ? <Stack>
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Stack> : artist && artist.stats && <Stack spacing={4} width="100%">
                <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="flex-start" maxWidth="800px">
                    <Stack spacing={4} direction="row" alignItems="center">
                        <Avatar
                            src={artist.imageUrl}
                            alt={artist.name}
                            sx={{ width: 150, height: 150, fontWeight: 600 }}
                        >
                            {artist.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Stack spacing={1}>
                            <Typography variant='h2'>
                                {artist.name}
                            </Typography>

                            <Typography variant='caption' color="text.secondary">
                                {followersCount} {followersCount <= 1 ? "suit" :
                                    "suivent"} • {artist.stats.releasesCount} {artist.stats.releasesCount <= 1 ? "titre" : "titres"}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Button
                        variant="contained"
                        onClick={handleFollowClick}
                        sx={{
                            minWidth: '120px',
                            borderRadius: '30px',
                            bgcolor: isFollowing ? "error.main" : "primary.main"
                        }}
                    >
                        {isFollowing ? "Ne plus suivre" : "Suivre"}
                    </Button>
                </Stack>

                <Tabs
                    value={tab}
                    onChange={(_, newTab: number) => setTab(newTab)}
                    sx={{
                        minHeight: '50px',
                        width: '100%',
                        '& .MuiTab-root': {
                            px: { xs: '20px', sm: '40px', md: '70px', lg: '100px' },
                        },
                    }}
                >
                    <Tab label="Albums" />
                    <Tab label="Singles" />
                </Tabs>

                {tab === 0 && sortedReleases.filter((r: IRelease) => r.type === 'ALBUM').map((release) =>
                    <ReleaseCard
                        key={release.spotifyId}
                        release={release}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />
                )}

                {tab === 1 && sortedReleases.filter((r: IRelease) => r.type === 'SINGLE').map((release) =>
                    <ReleaseCard
                        key={release.spotifyId}
                        release={release}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />
                )}
            </Stack>}
        </Stack>
    )
}