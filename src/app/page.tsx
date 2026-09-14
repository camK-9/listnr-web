'use client';

import { Alert, CircularProgress, Stack } from '@mui/material';
import { MediaGrid } from '@/components/organisms/MediaGrid';
import { releaseService } from '@/lib/releaseService';
import { useState, useEffect } from 'react';
import IRelease from '@/interfaces/IRelease';
import theme from '@/theme/theme';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReleases, setNewReleases] = useState<IRelease[]>([]);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const data = await releaseService.getNewReleases();

        setNewReleases(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Impossible de charger les sorties récentes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  return (
    <Stack spacing={4}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {loading ? <Stack>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Stack> : <MediaGrid
        title="Sorties récentes"
        items={newReleases}
      />}

      {/* <MediaGrid
        title="Populaires cette semaine"
        items={POPULAR_THIS_WEEK}
      /> */}
    </Stack>
  );
}