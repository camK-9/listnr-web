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
import ILibrary from '@/interfaces/ILibrary';
import { QueueGrid } from '@/components/organisms/QueueGrid';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReleases, setNewReleases] = useState<IRelease[]>([]);
  const [popularReviews, setPopularReviews] = useState<IReview[]>([]);
  const [feed, setFeed] = useState<IReview[]>([]);
  const [queue, setQueue] = useState<ILibrary[]>([]);

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
          onToggleQueue={handleToggleQueue}
          onToggleHistory={handleToggleHistory}
        />
      </Stack>}
    </Stack>
  );
}