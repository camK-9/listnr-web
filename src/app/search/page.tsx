'use client';

import { SearchCard } from "@/components/molecules/SearchCard";
import IArtist from "@/interfaces/IArtist";
import IRelease from "@/interfaces/IRelease";
import IUser from "@/interfaces/IUser";
import { artistService } from "@/lib/artistService";
import { libraryService } from "@/lib/libraryService";
import { releaseService } from "@/lib/releaseService";
import { userService } from "@/lib/userService";
import { CircularProgress, Stack, Tab, Tabs } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibraryPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [tab, setTab] = useState(0);
    const [releases, setReleases] = useState<IRelease[]>([]);
    const [artists, setArtists] = useState<IArtist[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (tab === 3) {
                    const data = await userService.search(query);
                    setUsers(data);
                } else if (tab === 2) {
                    const data = await artistService.search(query);
                    setArtists(data);
                } else {
                    const data = await releaseService.search(query);
                    setReleases(data);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tab, query]);

    const handleToggleQueue = async (releaseItem: IRelease) => {
        if (!query) return;

        try {
            await libraryService.toggleQueue(releaseItem.spotifyId);

            const data = await releaseService.search(query);
            setReleases(data);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la queue', err);
        }
    };

    const handleToggleHistory = async (releaseItem: IRelease) => {
        if (!query) return;

        try {
            await libraryService.toggleHistory(releaseItem.spotifyId);

            const data = await releaseService.search(query);
            setReleases(data);
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'historique :", err);
        }
    };

    const filteredReleases = releases.filter((r) => {
        if (tab === 0) return r.type === 'ALBUM';
        if (tab === 1) return r.type === 'SINGLE' || r.type === 'TRACK';
    });

    return (
        <Stack spacing={2}>
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
                <Tab label="Album" />
                <Tab label="Singles" />
                <Tab label="Artistes" />
                <Tab label="Membres" />
            </Tabs>

            {loading ? <Stack>
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Stack> : (tab === 0 || tab === 1) &&
            filteredReleases.map((release) => (
                <SearchCard
                    key={release.spotifyId}
                    release={release}
                    onToggleQueue={handleToggleQueue}
                    onToggleHistory={handleToggleHistory}
                />
            ))}

            {tab === 2 &&
                artists.map((artist) => (
                    <SearchCard
                        key={artist.spotifyId}
                        artist={artist}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />
                ))}

            {tab === 3 &&
                users.map((user) => (
                    <SearchCard
                        key={user.id}
                        user={user}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />
                ))}
        </Stack>
    )
}