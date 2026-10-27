'use client';

import { MusicLoader } from "@/components/atoms/MusicLoader";
import { SearchCard } from "@/components/molecules/SearchCard";
import { useDebounce } from "@/hooks/useDebounce";
import IArtist from "@/interfaces/IArtist";
import IRelease from "@/interfaces/IRelease";
import IUser from "@/interfaces/IUser";
import { artistService } from "@/lib/artistService";
import { libraryService } from "@/lib/libraryService";
import { releaseService } from "@/lib/releaseService";
import { userService } from "@/lib/userService";
import theme from "@/theme/theme";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, Stack, Tab, Tabs, TextField, useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibraryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [tab, setTab] = useState(0);
    const [releases, setReleases] = useState<IRelease[]>([]);
    const [artists, setArtists] = useState<IArtist[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(query || null);

    const debouncedSearchQuery = useDebounce(searchValue, 400);

    useEffect(() => {
        setSearchValue(query);
    }, [query]);

    useEffect(() => {
        const queryValue = debouncedSearchQuery || '';

        if (!queryValue.trim()) {
            router.replace('/search', { scroll: false });
            setReleases([]);
            setArtists([]);
            setUsers([]);
            return;
        }

        router.replace(`/search?q=${encodeURIComponent(queryValue)}`, { scroll: false });
    }, [debouncedSearchQuery, router]);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue?.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    };

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
            {isMobile && <Stack component="form" onSubmit={handleSearchSubmit}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Rechercher"
                    value={searchValue ?? ''}
                    onChange={(e) => setSearchValue(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon
                                        className="search-icon"
                                        icon={faMagnifyingGlass}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            bgcolor: 'transparant',
                            fontSize: '14px',
                            '& .search-icon': {
                                color: 'text.secondary',
                                transition: 'color 0.2s ease-in-out',
                            },
                            '& input::placeholder': {
                                color: 'text.secondary',
                                opacity: 1,
                                transition: 'color 0.2s ease-in-out',
                            },
                            '&:hover': {
                                '& .search-icon': {
                                    color: 'text.primary',
                                },
                                '& input::placeholder': {
                                    color: 'text.primary',
                                },
                            },
                            '&.Mui-focused': {
                                bgcolor: 'background.paper',
                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                            },
                        },
                    }}
                />
            </Stack>}

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

            {loading ? <MusicLoader /> : (tab === 0 || tab === 1) &&
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