import React, { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { MediaCard } from '../molecules/MediaCard';
import IRelease from '@/interfaces/IRelease';

export const MediaGrid = ({ title, items }: { title: string, items: IRelease[] }) => {
    const displayedItems = items && items.slice(0, 10) || [];
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container || isHovered || displayedItems.length === 0) return;

        const interval = setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: 130, behavior: 'smooth' });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isHovered, displayedItems]);

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
                {displayedItems.map((item: IRelease) => (
                    <Stack
                        key={item.spotifyId}
                        sx={{
                            width: { xs: "130px", sm: "150px", md: "170px" },
                            minWidth: { xs: "130px", sm: "150px", md: "170px" },
                            maxWidth: { xs: "130px", sm: "150px", md: "170px" },
                        }}
                    >
                        <MediaCard {...item} />
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};