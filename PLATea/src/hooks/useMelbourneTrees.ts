import { useEffect, useState } from 'react';

import { Bounds, fetchMelbourneTrees, Tree } from '@/services/cityOfMelbourne';

/*
 * Minimum time the loading screen stays up,
 * so the cherry blossom loading animation
 * doesn't just flash by.
 */
const MIN_LOADING_TIME_MS = 5000;

export function useMelbourneTrees(bounds: Bounds, limit: number) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrees() {
      setLoading(true);

      const startedAt = Date.now();

      const results = await fetchMelbourneTrees(bounds, limit);

      const remainingTime = Math.max(
        0,
        MIN_LOADING_TIME_MS - (Date.now() - startedAt)
      );

      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );

      setTrees(results);
      setLoading(false);
    }

    loadTrees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trees, loading };
}
