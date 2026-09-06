import { useEffect, useState } from 'react';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

type Coordinate = {
  latitude: number;
  longitude: number;
};

type UseWalkingRouteParams = {
  origin: Coordinate | null;
  destination: Coordinate | null;
  active: boolean; // only fetch while this is true
};

export function useWalkingRoute({
  origin,
  destination,
  active,
}: UseWalkingRouteParams) {
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !origin || !destination) {
      setRouteCoords([]);
      return;
    }

    const originCoord = origin;
    const destinationCoord = destination;

    let cancelled = false;

    async function fetchRoute() {
      try {
        setLoading(true);
        setError(null);

        const url =
          `https://api.mapbox.com/directions/v5/mapbox/walking/` +
          `${originCoord.longitude},${originCoord.latitude};` +
          `${destinationCoord.longitude},${destinationCoord.latitude}` +
          `?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Mapbox request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          throw new Error('No walking route found');
        }

        if (cancelled) return;

        const coords: Coordinate[] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })
        );

        setRouteCoords(coords);
      } catch (err) {
        if (cancelled) return;
        console.error('Route fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch route');
        setRouteCoords([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoute();

    return () => {
      cancelled = true;
    };
    // Only refetch when tracking toggles on/off, the destination
    // changes, or the origin first becomes available (tracking can
    // start before the device's first GPS fix comes back) - NOT on
    // every later origin update, which would spam the API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, destination?.latitude, destination?.longitude, Boolean(origin)]);

  return { routeCoords, loading, error };
}