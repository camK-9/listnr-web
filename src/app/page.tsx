'use client';

import { Alert, Button, Stack, Typography } from '@mui/material';
import { releaseService } from '@/lib/releaseService';
import { useState, useEffect, useRef } from 'react';
import IRelease from '@/interfaces/IRelease';
import IReview from '@/interfaces/IReview'
import { reviewService } from '@/lib/reviewService';
import { feedService } from '@/lib/feedService';
import { libraryService } from '@/lib/libraryService';
import ILibrary from '@/interfaces/ILibrary';
import { MusicLoader } from '@/components/atoms/MusicLoader';
import { NewReleaseCard } from '@/components/molecules/NewReleaseCard';
import { PopularReviewCard } from '@/components/molecules/PopularReviewCard';
import { ReviewCard } from '@/components/molecules/ReviewCard';
import { QueueCard } from '@/components/molecules/QueueCard';
import { EmptyQueue } from '@/components/molecules/EmptyQueue';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReleases, setNewReleases] = useState<IRelease[]>([]);
  const [popularReviews, setPopularReviews] = useState<IReview[]>([]);
  const [feed, setFeed] = useState<IReview[]>([]);
  const [queue, setQueue] = useState<ILibrary[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isHovered) return;

    const interval = setInterval(() => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 170, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [releasesData, reviewsData, feedData, queueData] = await Promise.all([
          releaseService.getNewReleases(),
          reviewService.getPopularReviews(),
          feedService.getFeedService(),
          libraryService.getQueue(1, 50),
        ]);

        setNewReleases(releasesData)
        setPopularReviews(reviewsData)
        setFeed(feedData)
        setQueue(queueData.data)
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Impossible de charger les sorties récentes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleQueue = async (releaseItem: IRelease) => {
    try {
      const result = await libraryService.toggleQueue(releaseItem.spotifyId);

      setQueue(result.data);

      const updatedReleases = await releaseService.getNewReleases()

      setNewReleases(updatedReleases)
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la queue', err);
    }
  };

  const handleToggleHistory = async (releaseItem: IRelease) => {
    try {
      await libraryService.toggleHistory(releaseItem.spotifyId);

      const [updatedReleases, updatedQueue] = await Promise.all([
        releaseService.getNewReleases(),
        libraryService.getQueue(1, 50),
      ]);

      setNewReleases(updatedReleases);
      setQueue(updatedQueue.data);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'historique :", err);
    }
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
    <Stack spacing={4}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {loading ? <MusicLoader /> : <Stack spacing={4}>
        <Stack spacing={2}>
          <Typography variant="body1" borderBottom="1px solid">
            Sorties récentes
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
            {newReleases.map((item: IRelease) => (
              <Stack key={item.spotifyId} width="170px" minWidth="170px" maxWidth="170px">
                <NewReleaseCard
                  item={item}
                  onToggleQueue={handleToggleQueue}
                  onToggleHistory={handleToggleHistory}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="body1" borderBottom="1px solid">
            Populaire cette semaine
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
            {popularReviews.slice(0, 10).map((item: IReview) => (
              <Stack key={item.id} width="170px" minWidth="170px" maxWidth="170px">
                <PopularReviewCard {...item} />
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" borderBottom="1px solid">
            <Typography variant="body1">
              Sur le feed
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
            {feed.slice(0, 10).map((item: IReview) => (
              <Stack key={item.id} width="300px" minWidth="300px" maxWidth="300px">
                <ReviewCard {...item} />
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" borderBottom="1px solid">
            <Typography variant="body1">
              Dans ton radar
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
                  queue={queue}
                  onToggleQueue={handleToggleQueue}
                  onToggleHistory={handleToggleHistory}
                />
              </Stack>
            ))}
          </Stack> :
            <EmptyQueue />
          }
        </Stack>
      </Stack>}
    </Stack>
  );
}