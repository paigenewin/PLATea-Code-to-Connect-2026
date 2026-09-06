import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { router } from 'expo-router';

import { Bounds } from '@/services/cityOfMelbourne';
import TreeMarkers from '@/components/map/treeMarkers';
import DestinationMarker from '@/components/map/destinationMarker';
import UserLocationMarker from '@/components/map/userLocationMarker';
import SelectedTreeCard from '@/components/map/selectedTreeCard';
import { useTreeTracking } from '@/hooks/useTreeTracking';
import { useMelbourneTrees } from '@/hooks/useMelbourneTrees';
import { useSelectedTree } from '@/hooks/useSelectedTree';
import { treeToRouteParams } from '@/utils/treeParams';
import { CherryBlossomBorder, FlowerBorderMode } from '@/components/flower-border';
import { LoadingScreen } from '@/components/loading-screen';

const MELBOURNE_BOUNDS: Bounds = {
  minLat: -37.97,
  maxLat: -37.7,
  minLng: 144.8,
  maxLng: 145.12,
};

const INITIAL_REGION: Region = {
  latitude: -37.8136,
  longitude: 144.9631,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [mapReady, setMapReady] = useState(false);
  const [flowerMode] = useState<FlowerBorderMode>('corners');

  const mapRef = useRef<MapView>(null);

  const { trees, loading } = useMelbourneTrees(
    MELBOURNE_BOUNDS,
    1000
  );

  const { selectedTree, hasSelectedTree } =
    useSelectedTree({ mapRef, mapReady });

  const {
    tracking,
    distance,
    userLocation,
    heading,
    startTracking,
    stopTracking,
  } = useTreeTracking({
    mapRef,
    treeLatitude: selectedTree.latitude,
    treeLongitude: selectedTree.longitude,
  });

  /*
   * Return from Map to Tree Details.
   */
  function backToTreeDetails() {
    router.push({
      pathname: '/tree-details',
      params: treeToRouteParams(selectedTree),
    });
  }

  return (
    <View style={styles.container}>

      {/* LOADING */}
      {loading && <LoadingScreen />}

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsMyLocationButton
        onMapReady={() =>
          setMapReady(true)
        }
      >

        {/* NORMAL MELBOURNE TREE MARKERS */}
        <TreeMarkers trees={trees} />

        {/* SELECTED TREE MARKER (destination) */}
        {hasSelectedTree && (
          <DestinationMarker
            latitude={Number(selectedTree.latitude)}
            longitude={Number(selectedTree.longitude)}
            title={selectedTree.commonName}
            description={selectedTree.scientificName}
          />
        )}

        {/* CUSTOM USER LOCATION MARKER */}
        {userLocation && (
          <UserLocationMarker
            coordinate={userLocation}
            heading={heading}
          />
        )}

      </MapView>

      <CherryBlossomBorder mode={flowerMode} />

      {/* SELECTED TREE POPUP */}
      {hasSelectedTree && (
        <SelectedTreeCard
          tree={selectedTree}
          distance={distance}
          tracking={tracking}

          onTrackPress={
            tracking
              ? stopTracking
              : startTracking
          }

          onDetailsPress={
            backToTreeDetails
          }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },
});