import React, { useEffect, useRef, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import ILibrary from '@/interfaces/ILibrary';
import IRelease from '@/interfaces/IRelease';
import { QueueCard } from '../molecules/QueueCard';
import { EmptyQueue } from '../molecules/EmptyQueue';
import { useRouter } from 'next/navigation';

export const QueueGrid = ({ title, items, onToggleQueue, onToggleHistory }:
    {
        title: string,
        items: ILibrary[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {
    const router = useRouter();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container || isHovered || items.length === 0) return;

        const interval = setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: 170, behavior: 'smooth' });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered, items]);

    const displayQueue = items.reduce<ILibrary[]>((acc, current) => {
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
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" borderBottom="1px solid">
                <Typography variant="body1">
                    {title}
                </Typography>

                <Button variant="text" onClick={() => router.push('/library')} sx={{ color: "text.secondary" }}>
                    voir tout
                </Button>
            </Stack>

            {displayQueue.length > 0 ? <Stack
                direction="row"
                gap={2}
                ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {displayQueue.map((item: ILibrary) => (
                    <Stack key={item.releaseId} width="170px" minWidth="170px" maxWidth="170px">
                        <QueueCard
                            item={item}
                            queue={items}
                            onToggleQueue={onToggleQueue}
                            onToggleHistory={onToggleHistory}
                        />
                    </Stack>
                ))}
            </Stack> :
                <EmptyQueue />
            }
        </Stack>
    );
};