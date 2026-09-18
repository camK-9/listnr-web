import React, { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import IListenQueue from '@/interfaces/IListenQueue';
import IListenHistory from '@/interfaces/IListenHistory';
import IRelease from '@/interfaces/IRelease';
import { QueueCard } from '../molecules/QueueCard';
import { EmptyRadar } from '../molecules/EmptyRadar';

export const QueueGrid = ({ title, items, queue, history, onToggleQueue, onToggleHistory }:
    {
        title: string,
        items: IListenQueue[],
        queue: IListenQueue[],
        history: IListenHistory[],
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease) => void
    }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const displayQueue = queue.reduce<IListenQueue[]>((acc, current) => {
        const alreadyInDisplay = acc.some(
            (item) => item.release?.spotifyUrl === current.release?.spotifyUrl
        );

        if (!alreadyInDisplay) {
            acc.push(current);
        }

        return acc;
    }, []);

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

    return (
        <Stack spacing={2}>
            <Typography variant="body1" borderBottom="1px solid">
                {title}
            </Typography>

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
                {displayQueue.map((item: IListenQueue) => (
                    <Stack
                        key={item.releaseId}
                        sx={{
                            width: "170px",
                            minWidth: "170px",
                            maxWidth: "170px"
                        }}
                    >
                        <QueueCard
                            item={item}
                            queue={queue}
                            history={history}
                            onToggleQueue={onToggleQueue}
                            onToggleHistory={onToggleHistory}
                        />
                    </Stack>
                ))}
            </Stack> :
                <EmptyRadar />
            }
        </Stack>
    );
};