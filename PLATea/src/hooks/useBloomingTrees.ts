import { useEffect, useState } from 'react';

import { fetchBloomingTrees } from '@/services/bloomApi';
import { Tree } from '@/services/cityOfMelbourne';

/*
 * Fetches trees matching whichever species are
 * currently blooming. Only runs while `enabled`
 * is true, so it stays idle outside blooming mode.
 */
export function useBloomingTrees(enabled: boolean) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    async function loadBloomingTrees() {
      setLoading(true);

      try {
        const { trees: results } = await fetchBloomingTrees();

        if (!cancelled) {
          setTrees(results);
        }
      } catch (error) {
        console.error(
          'Failed to load blooming trees for map:',
          error
        );

        if (!cancelled) {
          setTrees([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBloomingTrees();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { trees, loading };
}
