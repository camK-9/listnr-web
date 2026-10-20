'use client';

import { EmptyHistory } from "@/components/molecules/EmptyHistory";
import { EmptyQueue } from "@/components/molecules/EmptyQueue";
import { LibraryCard } from "@/components/molecules/LibraryCard";
import ILibrary from "@/interfaces/ILibrary";
import IRelease from "@/interfaces/IRelease";
import { libraryService } from "@/lib/libraryService";
import theme from "@/theme/theme";
import { Button, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export default function LibraryPage() {
    const [tab, setTab] = useState(0)
    const [queue, setQueue] = useState<ILibrary[]>([]);
    const [history, setHistory] = useState<ILibrary[]>([]);
    const [queuePage, setQueuePage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    const [hasMoreQueue, setHasMoreQueue] = useState(false);
    const [hasMoreHistory, setHasMoreHistory] = useState(false);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchData = async () => {
            const [queueData, historyData] = await Promise.all([
                libraryService.getQueue(1, 50),
                libraryService.getHistory(1, 10),
            ]);

            setQueue(queueData.data)
            setHistory(historyData.data)
            setHasMoreQueue(queueData.hasMore)
            setHasMoreHistory(historyData.hasMore)
        };

        fetchData();
    }, []);

    const handleToggleQueue = async (releaseItem: IRelease) => {
        try {
            const result = await libraryService.toggleQueue(releaseItem.spotifyId);

            setQueue(result.data);
            setHasMoreQueue(result.hasMore)
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la queue', err);
        }
    };

    const handleToggleHistory = async (releaseItem: IRelease) => {
        try {
            const updatedHistory = await libraryService.toggleHistory(releaseItem.spotifyId);
            setHistory(updatedHistory.data);
            setHasMoreHistory(updatedHistory.hasMore)

            const updatedQueue = await libraryService.getQueue(1, 50);
            setQueue(updatedQueue.data);
            setHasMoreQueue(updatedQueue.hasMore)
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'historique :", err);
        }
    };

    const loadMoreQueue = async () => {
        const nextPage = queuePage + 1;
        const res = await libraryService.getQueue(nextPage, 50);

        setQueue((prev) => [...prev, ...res.data]);
        setQueuePage(nextPage);
        setHasMoreQueue(res.hasMore);
    };

    const loadMoreHistory = async () => {
        const nextPage = historyPage + 1;
        const res = await libraryService.getHistory(nextPage, 10);

        setHistory((prev) => [...prev, ...res.data]);
        setHistoryPage(nextPage);
        setHasMoreHistory(res.hasMore);
    };

    const displayQueue = queue.reduce<ILibrary[]>((acc, current) => {
        const albumId = current.release.albumId || current.release.spotifyId;

        const alreadyInDisplay = acc.some(
            (item) => (item.release.albumId || item.release.spotifyId) === albumId
        );

        if (!alreadyInDisplay) {
            acc.push(current);
        }

        return acc;
    }, []);

    return (
        <Stack spacing={8} direction={isMobile ? "column" : "row"} justifyContent="space-between">
            <Stack spacing={4} maxWidth="600px" minWidth="350px" width="100%">
                <Tabs
                    value={tab}
                    onChange={(_, newTab: number) => setTab(newTab)}
                    sx={{ height: '50px' }}
                >
                    <Tab label="À écouter" />
                    <Tab label="À venir" />
                </Tabs>

                <Stack spacing={4} sx={{ display: tab == 0 ? 'flex' : 'none' }}>
                    {displayQueue.length === 0 ? <EmptyQueue /> : displayQueue.map((item: ILibrary) => (
                        <LibraryCard
                            key={item.releaseId}
                            type={'queue'}
                            time={'now'}
                            item={item}
                            queue={queue}
                            onToggleQueue={handleToggleQueue}
                            onToggleHistory={handleToggleHistory}
                        />
                    ))}

                    {hasMoreQueue && <Button variant="outlined" onClick={loadMoreQueue}>
                        Voir plus
                    </Button>}
                </Stack>
            </Stack>

            <Stack spacing={4} sx={{ display: tab == 0 ? 'flex' : 'none' }} flex="0 1 450px" minWidth="350px">
                <Typography
                    variant="h2"
                    sx={{
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    Historique d'écoute
                </Typography>

                {history.length === 0 ? <EmptyHistory /> : history.map((item: ILibrary) => (
                    <LibraryCard
                        key={item.releaseId}
                        type={'history'}
                        time={'now'}
                        item={item}
                        queue={queue}
                        onToggleQueue={handleToggleQueue}
                        onToggleHistory={handleToggleHistory}
                    />
                ))}

                {hasMoreHistory && <Button variant="outlined" onClick={loadMoreHistory}>
                    Voir plus
                </Button>}
            </Stack>
        </Stack>
    )
}