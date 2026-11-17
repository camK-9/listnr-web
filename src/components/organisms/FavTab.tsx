import IUser from "@/interfaces/IUser";
import { faChevronDown, faChevronLeft, faChevronRight, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Button, Menu, MenuItem, Typography, Avatar, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { libraryService } from "@/lib/libraryService";
import { userService } from "@/lib/userService";

export default function FavTab({ profile, id }: { profile: IUser, id: string }) {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeTab, setActiveTab] = useState<'tracks' | 'albums' | 'artists'>('tracks');
    const [searchQuery, setSearchQuery] = useState('');
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [favoriteTracks, setFavoriteTracks] = useState<any[]>(profile.favoriteTracks || []);
    const [favoriteAlbums, setFavoriteAlbums] = useState<any[]>(profile.favoriteAlbums || []);
    const [favoriteArtists, setFavoriteArtists] = useState<any[]>(profile.favoriteArtists || []);

    useEffect(() => {
        setFavoriteTracks(profile.favoriteTracks || []);
        setFavoriteAlbums(profile.favoriteAlbums || []);
        setFavoriteArtists(profile.favoriteArtists || []);
    }, [profile]);

    const getCurrentFavorites = () => {
        switch (activeTab) {
            case 'albums': return favoriteAlbums;
            case 'artists': return favoriteArtists;
            case 'tracks':
            default: return favoriteTracks;
        }
    };

    const processRawHistory = (data: any[]) => {
        if (activeTab === 'artists') {
            const artistMap = new Map();
            data.forEach((entry: any) => {
                const artist = entry.release?.artist || entry.artist;
                if (artist && !artistMap.has(artist.id)) {
                    artistMap.set(artist.id, artist);
                }
            });
            return Array.from(artistMap.values());
        } else if (activeTab === 'albums') {
            const albumMap = new Map();
            data.forEach((entry: any) => {
                const album = entry.release?.album;
                if (album && album.id && !albumMap.has(album.id)) {
                    albumMap.set(album.id, album);
                }
            });
            return Array.from(albumMap.values());
        } else {
            const releaseMap = new Map();
            data.forEach((entry: any) => {
                const release = entry.release || entry;
                if (release && release.id && !releaseMap.has(release.id)) {
                    releaseMap.set(release.id, release);
                }
            });
            return Array.from(releaseMap.values());
        }
    };

    const fetchHistory = async (targetPage: number, query: string, isAppending = false) => {
        setLoading(true)

        try {
            let currentPage = targetPage;
            let currentHasMore = true;
            let accumulatedEntries = isAppending ? [...historyData] : [];
            let filteredResultsCount = 0;

            const pinnedIds = new Set(getCurrentFavorites().map((fav: any) => fav.id));

            do {
                const response = await libraryService.getHistory(currentPage, 10, query);
                const newEntries = response?.data || [];
                currentHasMore = response?.hasMore || false;

                if (newEntries.length === 0) {
                    currentHasMore = false;
                    break;
                }

                if (isAppending) {
                    accumulatedEntries = [...accumulatedEntries, ...newEntries];
                } else {
                    accumulatedEntries = newEntries;
                }

                const processed = processRawHistory(accumulatedEntries);
                const filtered = processed.filter((item: any) => !pinnedIds.has(item.id));
                filteredResultsCount = filtered.length;

                if (!isAppending && filteredResultsCount === 0 && currentHasMore) {
                    currentPage += 1;
                } else {
                    break;
                }
            } while (currentHasMore);

            setHistoryData(accumulatedEntries);
            setHasMore(currentHasMore);
            setPage(currentPage);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique :", error);
            if (!isAppending) setHistoryData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isModalOpen) return;

        setPage(1);
        const timer = setTimeout(() => {
            fetchHistory(1, searchQuery, false);
        }, 300);

        return () => clearTimeout(timer);
    }, [isModalOpen, searchQuery, activeTab]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHistory(nextPage, searchQuery, true);
    };

    const handleSelectTab = (tab: 'tracks' | 'albums' | 'artists') => {
        setActiveTab(tab);
        setAnchorEl(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSearchQuery('');
        setPage(1);
    };

    const handleAddFav = async (type: 'tracks' | 'albums' | 'artists', id: string) => {
        try {
            const data = await userService.addFav(type, id);

            const item = data.release || data.artist;

            if (type === 'tracks') {
                setFavoriteTracks(prev => [...prev, item]);
            } else if (type === 'albums') {
                setFavoriteAlbums(prev => [...prev, item]);
            } else if (type === 'artists') {
                setFavoriteArtists(prev => [...prev, item]);
            }

            handleCloseModal()
        } catch (error: any) {
            console.error("Erreur lors de l'ajout aux favoris :", error);
        }
    };

    const handleRemoveFav = async (targetType: 'tracks' | 'albums' | 'artists', id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await userService.removeFav(targetType, id);

            if (targetType === 'tracks') setFavoriteTracks(prev => prev.filter((item: any) => item.id !== id));
            else if (targetType === 'albums') setFavoriteAlbums(prev => prev.filter((item: any) => item.id !== id));
            else if (targetType === 'artists') setFavoriteArtists(prev => prev.filter((item: any) => item.id !== id));
        } catch (error: any) {
            console.error("Erreur lors de la suppression du favori :", error);
        }
    };

    const handleMove = async (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
        e.stopPropagation();
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const newItems = [...items];
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;

        if (activeTab === 'tracks') setFavoriteTracks(newItems);
        else if (activeTab === 'albums') setFavoriteAlbums(newItems);
        else if (activeTab === 'artists') setFavoriteArtists(newItems);

        try {
            const itemIds = newItems.map((item: any) => item.id);
            await userService.reorderFav(activeTab, itemIds);
        } catch (error) {
            console.error("Erreur lors de la réorganisation :", error);
        }
    };

    const getTabData = () => {
        switch (activeTab) {
            case 'albums':
                return {
                    title: 'Albums favoris',
                    items: favoriteAlbums || [],
                    type: 'albums'
                };
            case 'artists':
                return {
                    title: 'Artistes favoris',
                    items: favoriteArtists || [],
                    type: 'artists'
                };
            case 'tracks':
            default:
                return {
                    title: 'Musiques favorites',
                    items: favoriteTracks || [],
                    type: 'tracks'
                };
        }
    };

    const { title, items, type } = getTabData();

    const slots = Array.from({ length: 10 }, (_, index) => items[index] || null);

    const historyItems = useMemo(() => {
        if (!historyData || historyData.length === 0) return [];

        const rawItems = processRawHistory(historyData);
        const pinnedIds = new Set(items.map((fav: any) => fav.id));

        return rawItems.filter((item: any) => !pinnedIds.has(item.id));
    }, [historyData, activeTab, items]);

    if (!profile.favoriteTracks && !profile.favoriteAlbums && !profile.favoriteArtists) return null;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" borderBottom="1px solid">
                <Button
                    variant="text"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
                    endIcon={<FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} />}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            bgcolor: 'text.disabled',
                        }
                    }}
                >
                    {title}
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '180px' } }}
                >
                    <MenuItem
                        onClick={() => handleSelectTab('tracks')}
                        sx={{
                            fontSize: '15px',
                            p: '15px',
                            '&:hover': { bgcolor: 'primary.main' }
                        }}
                    >
                        Musiques favorites
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSelectTab('albums')}
                        sx={{
                            fontSize: '15px',
                            p: '15px',
                            '&:hover': { bgcolor: 'primary.main' }
                        }}
                    >
                        Albums favoris
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSelectTab('artists')}
                        sx={{
                            fontSize: '15px',
                            p: '15px',
                            '&:hover': { bgcolor: 'primary.main' }
                        }}
                    >
                        Artistes favoris
                    </MenuItem>
                </Menu>

                <Button
                    variant="text"
                    onClick={() => router.push(`/user/${id}/fav`)}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            bgcolor: 'text.disabled',
                        }
                    }}
                >
                    voir tout
                </Button>
            </Stack>

            <Stack
                spacing={2}
                direction="row"
                sx={{
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {slots.map((fav: any, index: number) => {
                    if (fav) {
                        const name = type === 'artists' ? fav.name : fav.title;
                        const imageUrl = fav.imageUrl;
                        const link = type === 'artists' ? `/artist/${fav.spotifyId}` : `/release/${fav.spotifyId}`;

                        return (
                            <Stack
                                key={index}
                                onClick={() => router.push(link)}
                                sx={{
                                    cursor: 'pointer',
                                    minWidth: '150px',
                                    maxWidth: '150px',
                                    position: 'relative',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': { transform: 'translateY(-4px)' },
                                    ...(profile.id === id && {
                                        '&:hover .hover-control': {
                                            opacity: 1,
                                            visibility: 'visible'
                                        }
                                    })
                                }}
                            >
                                <Stack
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    <Image src={imageUrl} alt={name} width={150} height={150} />

                                    {profile.id === id && index > 0 && <Stack
                                        className="hover-control"
                                        onClick={(e) => handleMove(index, 'left', e)}
                                        sx={{
                                            position: 'absolute',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            left: 8,
                                            top: '50%',
                                            width: 25,
                                            height: 25,
                                            bgcolor: 'background.paper',
                                            color: 'text.primary',
                                            borderRadius: '50%',
                                            zIndex: 1,
                                            opacity: 0,
                                            visibility: 'hidden',
                                            transform: 'translateY(-50%)',
                                            transition: 'opacity 0.2s ease',
                                            '&:hover': { bgcolor: 'primary.main' }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} size="2xs" />
                                    </Stack>}

                                    {profile.id === id && index < items.length - 1 && <Stack
                                        className="hover-control"
                                        onClick={(e) => handleMove(index, 'right', e)}
                                        sx={{
                                            position: 'absolute',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            right: 8,
                                            top: '50%',
                                            width: 25,
                                            height: 25,
                                            bgcolor: 'background.paper',
                                            color: 'text.primary',
                                            borderRadius: '50%',
                                            zIndex: 1,
                                            opacity: 0,
                                            visibility: 'hidden',
                                            transform: 'translateY(-50%)',
                                            transition: 'opacity 0.2s ease',
                                            '&:hover': { bgcolor: 'primary.main' }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} size="2xs" />
                                    </Stack>}

                                    {profile.id === id && <Stack
                                        className="hover-control"
                                        onClick={(e) => handleRemoveFav(activeTab, fav.id, e)}
                                        sx={{
                                            position: 'absolute',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            top: 8,
                                            right: 8,
                                            width: 25,
                                            height: 25,
                                            bgcolor: 'background.paper',
                                            color: 'text.primary',
                                            borderRadius: '50%',
                                            zIndex: 1,
                                            opacity: 0,
                                            visibility: 'hidden',
                                            transition: 'opacity 0.2s ease',
                                            '&:hover': { bgcolor: 'error.main' }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} size="2xs" />
                                    </Stack>}
                                </Stack>

                                <Typography variant="caption" color="text.secondary">
                                    {name}
                                </Typography>
                            </Stack>
                        )
                    }

                    return (
                        <Stack
                            key={index}
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => profile.id === id && setIsModalOpen(true)}
                            sx={{
                                minWidth: '150px',
                                maxWidth: '150px',
                                height: '150px',
                                border: '2px dashed',
                                borderColor: 'divider',
                                borderRadius: '15px',
                                cursor: profile.id === id ? 'pointer' : 'default',
                                transition: 'all 0.2s ease',
                                '& .add-button': { color: 'divider' },
                                '&:hover': profile.id === id ? {
                                    borderColor: 'text.primary',
                                    bgcolor: 'primary.main',
                                    '& .add-button': { color: 'text.primary' },
                                } : {}
                            }}
                        >
                            {profile.id === id && <Stack className="add-button">
                                <FontAwesomeIcon icon={faPlus} />
                            </Stack>}
                        </Stack>
                    );
                })}
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={() => handleCloseModal()}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: { borderRadius: '20px', p: "10px" }
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" component="span">
                        Ajouter à vos {title.toLowerCase()}
                    </Typography>

                    <IconButton onClick={() => handleCloseModal()}>
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt="10px">
                        <TextField
                            fullWidth
                            placeholder={activeTab === 'artists' ? "Rechercher un artiste écouté..." : "Rechercher dans votre historique..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            size="small"
                            autoFocus
                        />

                        <List sx={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {historyItems.length === 0 ? <Typography variant="body2" color="text.secondary" align="center" py="20px">
                                {searchQuery ? "Aucun résultat trouvé dans l'historique." : "Votre historique est vide."}
                            </Typography> : loading ? <CircularProgress /> : historyItems.map((item: any) => {
                                const name = activeTab === 'artists' ? item.name : item.title;
                                const artistName = activeTab === 'artists' ? '' : item.artist?.name;
                                const imageUrl = activeTab === 'artists' ? (item.imageUrl || item.avatarUrl) : item.imageUrl;

                                return (
                                    <ListItem
                                        key={item.id}
                                        component="div"
                                        onClick={() => handleAddFav(type as 'tracks' | 'albums' | 'artists', item.id)}
                                        sx={{
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'primary.main' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={imageUrl}
                                                variant={activeTab === 'artists' ? 'circular' : 'rounded'}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={name}
                                            secondary={artistName}
                                        />
                                    </ListItem>
                                );
                            })}
                            {hasMore && (
                                <Stack>
                                    <Button onClick={handleLoadMore}>
                                        Voir plus
                                    </Button>
                                </Stack>
                            )}
                        </List>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}