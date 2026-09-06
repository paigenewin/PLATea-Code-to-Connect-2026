import { RefObject, useEffect } from 'react';
import MapView from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

export type SelectedTreeParams = {
  id?: string;
  commonName?: string;
  scientificName?: string;
  genus?: string;
  family?: string;
  precinct?: string;
  locationType?: string;
  datePlanted?: string;
  ageDescription?: string;
  dbh?: string;
  latitude?: string;
  longitude?: string;
  focusKey?: string;
  autoTrack?: string;
};

type Options = {
  mapRef: RefObject<MapView | null>;
  mapReady: boolean;
};

/*
 * Reads the tree selected from Search / Tree
 * Details out of the route params, and zooms
 * the map to it whenever it changes.
 */
export function useSelectedTree({ mapRef, mapReady }: Options) {
  const selectedTree = useLocalSearchParams<SelectedTreeParams>();

  useEffect(() => {
    if (
      !mapReady ||
      !selectedTree.latitude ||
      !selectedTree.longitude
    ) {
      return;
    }

    const latitude = Number(selectedTree.latitude);
    const longitude = Number(selectedTree.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      700
    );
  }, [
    mapReady,
    selectedTree.latitude,
    selectedTree.longitude,
    selectedTree.focusKey,
  ]);

  const hasSelectedTree = Boolean(
    selectedTree.latitude && selectedTree.longitude
  );

  return { selectedTree, hasSelectedTree };
}
