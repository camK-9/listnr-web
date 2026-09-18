'use client';

import { Alert, CircularProgress, Stack } from '@mui/material';
import { ReleaseGrid } from '@/components/organisms/ReleaseGrid';
import { releaseService } from '@/lib/releaseService';
import { useState, useEffect } from 'react';
import IRelease from '@/interfaces/IRelease';
import IReview from '@/interfaces/IReview'
import { reviewService } from '@/lib/reviewService';
import { PopularReviewGrid } from '@/components/organisms/PopularReviewGrid';
import { FeedGrid } from '@/components/organisms/FeedGrid';
import { feedService } from '@/lib/feedService';
import { libraryService } from '@/lib/libraryService';
import IListenQueue from '@/interfaces/IListenQueue';
import IListenHistory from '@/interfaces/IListenHistory';
import { QueueGrid } from '@/components/organisms/QueueGrid';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReleases, setNewReleases] = useState<IRelease[]>([]);
  const [popularReviews, setPopularReviews] = useState<IReview[]>([]);
  const [feed, setFeed] = useState<IReview[]>([]);
  const [queue, setQueue] = useState<IListenQueue[]>([]);
  const [history, setHistory] = useState<IListenHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [releasesData, reviewsData, feedData, queueData, historyData] = await Promise.all([
          releaseService.getNewReleases(),
          reviewService.getPopularReviews(),
          feedService.getFeedService(),
          libraryService.getQueue(),
          libraryService.getHistory(),
        ]);

        setNewReleases(releasesData)
        setPopularReviews(reviewsData)
        setFeed(feedData)
        setQueue(queueData)
        setHistory(historyData)
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

      setQueue(result);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la queue', err);
    }
  };

  const handleToggleHistory = async (releaseItem: IRelease) => {
    try {
      const updatedHistory = await libraryService.toggleHistory(releaseItem.spotifyId);
      setHistory(updatedHistory);

      const updatedQueue = await libraryService.getQueue();
      setQueue(updatedQueue);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'historique :", err);
    }
  };

  return (
    <Stack spacing={4}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {loading ? <Stack>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Stack> : <Stack spacing={4}>
        <ReleaseGrid
          title="Sorties récentes"
          items={newReleases}
          queue={queue}
          history={history}
          onToggleQueue={handleToggleQueue}
          onToggleHistory={handleToggleHistory}
        />

        <PopularReviewGrid
          title="Populaire cette semaine"
          items={popularReviews}
        />

        <FeedGrid
          title="Sur le feed"
          items={feed}
        />

        <QueueGrid
          title="Dans ton radar"
          items={queue}
          queue={queue}
          history={history}
          onToggleQueue={handleToggleQueue}
          onToggleHistory={handleToggleHistory}
        />
      </Stack>}
    </Stack>
  );
}