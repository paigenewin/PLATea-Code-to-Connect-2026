import { useEffect, useState } from 'react';
import { BloomStatus, fetchBloomPrediction } from '@/services/bloomApi';

export function useBloomPrediction(scientificName?: string) {
  const [bloomStatus, setBloomStatus] = useState<BloomStatus | null>(null);
  const [bloomError, setBloomError] = useState(false);
  const [bloomLoading, setBloomLoading] = useState(false);

  useEffect(() => {
    if (!scientificName) {
      setBloomStatus(null);
      setBloomError(false);
      return;
    }

    let cancelled = false;
    setBloomLoading(true);
    setBloomError(false);
    setBloomStatus(null);

    fetchBloomPrediction(scientificName)
      .then((status) => {
        if (!cancelled) {
          setBloomStatus(status);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch bloom prediction:', error);
        if (!cancelled) {
          setBloomError(true);
          setBloomStatus(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBloomLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [scientificName]);

  return { bloomStatus, bloomLoading, bloomError };
}
