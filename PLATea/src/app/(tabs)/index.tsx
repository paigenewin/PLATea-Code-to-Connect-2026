import { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
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
import { identifyPlantPhoto } from '@/services/identifyApi';
import { fetchNearbyTrees, NearbyTree } from '@/services/bloomApi';

import RouteFinding from '@/components/map/routeFinding';
import { useWalkingRoute } from '@/hooks/routeFinding';

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
  const [identifying, setIdentifying] = useState(false);
  const [imageSearchResults, setImageSearchResults] =
    useState<NearbyTree[] | null>(null);

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

  const { routeCoords } = useWalkingRoute({
    origin: userLocation,
    destination: hasSelectedTree
      ? {
          latitude: Number(selectedTree.latitude),
          longitude: Number(selectedTree.longitude),
        }
      : null,
    active: tracking,
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

  /*
   * Deselect the current tree and clear
   * its params from the route.
   */
  function closeSelectedTree() {
    if (tracking) {
      stopTracking();
    }

    router.replace('/');
  }

  /*
   * Find real City of Melbourne trees matching an
   * identified species, nearest first, so the photo
   * search can show and locate them. Best-effort -
   * returns [] if location isn't available or nothing
   * nearby matches.
   */
  async function findNearbyMatches(
    scientificName: string
  ): Promise<NearbyTree[]> {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      return [];
    }

    const position =
      (await Location.getLastKnownPositionAsync()) ??
      (await Location.getCurrentPositionAsync());

    return fetchNearbyTrees(
      scientificName,
      position.coords.latitude,
      position.coords.longitude,
      8
    ).catch(() => []);
  }

  /*
   * Take a photo, send it to PLATea's identify
   * endpoint, and jump to Tree Details for
   * whatever species comes back.
   */
  async function searchByImage() {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Camera access needed',
        'PLATea needs camera access to identify a flower from a photo.'
      );
      return;
    }

    const photo = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (photo.canceled || !photo.assets[0]) {
      return;
    }

    setIdentifying(true);

    try {
      const result = await identifyPlantPhoto(photo.assets[0].uri);

      if (!result.identified || !result.scientificName) {
        Alert.alert(
          'Couldn\'t identify that',
          'Try a clearer, closer photo of the flower or leaves.'
        );
        return;
      }

      const nearbyMatches = await findNearbyMatches(
        result.scientificName
      );

      if (nearbyMatches.length > 0) {
        setImageSearchResults(nearbyMatches);
        sheetRef.current?.expand();
        return;
      }

      router.push({
        pathname: '/tree-details',
        params: treeToRouteParams({
          commonName: result.commonName ?? undefined,
          scientificName: result.scientificName,
        }),
      });
    } catch (error) {
      console.error('Image search failed:', error);

      Alert.alert(
        'Something went wrong',
        'Could not identify that photo. Check your connection and try again.'
      );
    } finally {
      setIdentifying(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* LOADING */}
      {(loading || identifying) && <LoadingScreen />}

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

        {/* WALKING ROUTE TO SELECTED TREE */}
        <RouteFinding coordinates={routeCoords} />

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
          containerStyle={[
            styles.searchBar,
            { top: insets.top + SEARCH_BAR_TOP_MARGIN },
          ]}
          value={query}
          onChangeText={(text) => {
            setBloomingOnly(false);
            setImageSearchResults(null);
            setQuery(text);
          }}
          onFocus={() => sheetRef.current?.expand()}
          onCameraPress={searchByImage}
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

          onClose={
            closeSelectedTree
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
              setImageSearchResults(null);
            }
          }}
          imageSearchResults={imageSearchResults}
          onClearImageSearch={() => setImageSearchResults(null)}
        />
      )}

    </View>
  );
}
