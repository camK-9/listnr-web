import React, { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ReleaseCard } from '../molecules/ReleaseCard';
import IRelease from '@/interfaces/IRelease';
import IListenHistory from '@/interfaces/IListenHistory';
import IListenQueue from '@/interfaces/IListenQueue';

export const ReleaseGrid = ({ title, items, queue, history, onToggleQueue, onToggleHistory }:
    {
        title: string,
        items: IRelease[],
        queue: IListenQueue[],
        history: IListenHistory[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {
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
        }, 3000);

        return () => clearInterval(interval);
    }, [isHovered, items]);

    return (
        <Stack spacing={2}>
            <Typography variant="body1" borderBottom="1px solid">
                {title}
            </Typography>

            <Stack
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
                {items.map((item: IRelease) => (
                    <Stack
                        key={item.spotifyId}
                        sx={{
                            width: "170px",
                            minWidth: "170px",
                            maxWidth: "170px"
                        }}
                    >
                        <ReleaseCard
                            item={item}
                            queue={queue}
                            history={history}
                            onToggleQueue={onToggleQueue}
                            onToggleHistory={onToggleHistory}
                        />
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};