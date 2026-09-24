import React, { useEffect, useRef, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import IReview from '@/interfaces/IReview';
import { ReviewCard } from '../molecules/ReviewCard';
import { useRouter } from 'next/navigation';

export const FeedGrid = ({ title, items }: { title: string, items: IReview[] }) => {
    const router = useRouter();

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
                container.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered, displayedItems]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" borderBottom="1px solid">
                <Typography variant="body1">
                    {title}
                </Typography>

                <Button variant="text" onClick={() => router.push('/feed')} sx={{ color: "text.secondary" }}>
                    voir tout
                </Button>
            </Stack>

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
                {displayedItems.map((item: IReview) => (
                    <Stack
                        key={item.id}
                        sx={{
                            width: '300px',
                            minWidth: '300px',
                            maxWidth: '300px',
                        }}
                    >
                        <ReviewCard {...item} />
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};