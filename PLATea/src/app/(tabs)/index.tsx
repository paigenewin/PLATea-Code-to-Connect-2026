import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import {styles} from '../../hooks/index';

import { Bounds } from '@/services/cityOfMelbourne';
import TreeMarkers from '@/components/map/treeMarkers';
import DestinationMarker from '@/components/map/destinationMarker';
import UserLocationMarker from '@/components/map/userLocationMarker';
import SelectedTreeCard from '@/components/map/selectedTreeCard';
import ExploreSheet from '@/components/map/exploreSheet';
import SearchBar from '@/components/searchBar';
import { useTreeTracking } from '@/hooks/useTreeTracking';
import { useMelbourneTrees } from '@/hooks/useMelbourneTrees';
import { useBloomingTrees } from '@/hooks/useBloomingTrees';
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

const SEARCH_BAR_TOP_MARGIN = 12;
const SEARCH_BAR_HEIGHT = 52;
const SEARCH_BAR_BOTTOM_MARGIN = 12;

export default function MapScreen() {
  const [mapReady, setMapReady] = useState(false);
  const [flowerMode] = useState<FlowerBorderMode>('corners');
  const [query, setQuery] = useState('');
  const [bloomingOnly, setBloomingOnly] = useState(false);

  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const {
    trees: allTrees,
    loading: allTreesLoading,
  } = useMelbourneTrees(MELBOURNE_BOUNDS, 1000);

  const {
    trees: bloomingTrees,
    loading: bloomingTreesLoading,
  } = useBloomingTrees(bloomingOnly);

  const trees = bloomingOnly ? bloomingTrees : allTrees;
  const loading = bloomingOnly
    ? bloomingTreesLoading
    : allTreesLoading;

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

      {/* SEARCH BAR (focus opens the sheet) */}
      {!hasSelectedTree && (
        <SearchBar
          style={[
            styles.searchBar,
            { top: insets.top + SEARCH_BAR_TOP_MARGIN },
          ]}
          value={query}
          onChangeText={(text) => {
            setBloomingOnly(false);
            setQuery(text);
          }}
          onFocus={() => sheetRef.current?.expand()}
        />
      )}

      <CherryBlossomBorder mode={flowerMode} />

      {/*
       * A selected tree's popup takes over the
       * bottom of the screen instead of the
       * search sheet, so they don't collide.
       */}
      {hasSelectedTree ? (
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
      ) : (
        <ExploreSheet
          ref={sheetRef}
          query={query}
          bloomingOnly={bloomingOnly}
          topInset={
            insets.top +
            SEARCH_BAR_TOP_MARGIN +
            SEARCH_BAR_HEIGHT +
            SEARCH_BAR_BOTTOM_MARGIN
          }
          onBloomingOnlyChange={(value) => {
            setBloomingOnly(value);
            if (value) {
              setQuery('');
            }
          }}
        />
      )}

    </View>
  );
}
