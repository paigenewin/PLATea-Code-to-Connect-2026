import 'maplibre-gl/dist/maplibre-gl.css';

import React, { useEffect, useRef, useState } from 'react';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Layer, MapRef, Marker, Source } from 'react-map-gl/maplibre';
import { CherryBlossomBorder, FlowerBorderMode } from '../../components/flower-border';

import { styles } from '../../styles/index.web';
import { Alert, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { useBloomingTrees } from '@/hooks/useBloomingTrees';
import { useSelectedTree } from '@/hooks/useSelectedTree';
import SearchBar from '@/components/searchBar';
import ExploreSheet from '@/components/map/exploreSheet';
import SelectedTreeCard from '@/components/map/selectedTreeCard';
import type BottomSheet from '@gorhom/bottom-sheet';
import { fetchNearbyTrees, NearbyTree } from '@/services/bloomApi';
import { identifyPlantPhoto } from '@/services/identifyApi';
import { treeToRouteParams } from '@/utils/treeParams';
import { LoadingScreen } from '../../components/loading-screen';
import { Bounds } from '../../services/cityOfMelbourne';
import { useMelbourneTrees } from '@/hooks/useMelbourneTrees';
import { useTreeTracking } from '@/hooks/useTreeTracking';
import { useWalkingRoute } from '@/hooks/routeFinding';
import { MapCameraController } from '@/types/mapCamera';

// Darkmode and lightmode

const LIGHTMODE_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const DARKMODE_STYLE =  'https://tiles.openfreemap.org/styles/fiord';

const SEARCH_BAR_TOP_MARGIN = 12;
const SEARCH_BAR_HEIGHT = 52;
const SEARCH_BAR_BOTTOM_MARGIN = 12;

setWorkerUrl(
  'https://cdn.jsdelivr.net/npm/maplibre-gl@6.10.0/dist/maplibre-gl-worker.mjs'
);

const MELBOURNE_BOUNDS: Bounds = {
  minLat: -37.97,
  maxLat: -37.7,
  minLng: 144.8,
  maxLng: 145.12,
};

const MELBOURNE_CENTER = {
  latitude: -37.8136,
  longitude: 144.9631,
};


export default function MapScreenWeb() {
  const colorScheme = useColorScheme();
  const mapStyle = colorScheme === 'dark' ? DARKMODE_STYLE : LIGHTMODE_STYLE;

  const [flowerMode] = useState<FlowerBorderMode>('corners');
  const [mapReady, setMapReady] = useState(false);

  const [query, setQuery] = useState('');
  const [bloomingOnly, setBloomingOnly] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [imageSearchResults, setImageSearchResults] =
    useState<NearbyTree[] | null>(null);

  /*Map */
  const mapRef = useRef<MapRef>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  /*Camera Controller */
  const cameraController = useRef<MapCameraController>({
    animateToRegion: (region, duration) => {
      mapRef.current?.flyTo({
        center: [region.longitude, region.latitude],
        zoom: 15,
        duration,
      });
    },
    animateCamera: (camera, opts) => {
      mapRef.current?.flyTo({
        center: camera.center
          ? [camera.center.longitude, camera.center.latitude]
          : undefined,
        zoom: camera.zoom,
        bearing: camera.heading,
        duration: opts?.duration,
      });
    },
  });

  const { selectedTree, hasSelectedTree } =
    useSelectedTree({ mapRef: cameraController, mapReady });

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


  const {
    tracking,
    distance,
    userLocation,
    heading,
    startTracking,
    stopTracking,
  } = useTreeTracking({
    mapRef: cameraController,
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

  /* Find nearby matches */
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
   * Select a tree from a results list and start
   * tracking it immediately, without the extra
   * step of opening its Tree Details first.
   */
  function trackFromList(tree: {
    id?: string;
    commonName?: string | null;
    scientificName?: string | null;
    precinct?: string | null;
    latitude: number;
    longitude: number;
  }) {
    router.replace({
      pathname: '/',
      params: {
        ...treeToRouteParams({
          id: tree.id,
          commonName: tree.commonName ?? undefined,
          scientificName: tree.scientificName ?? undefined,
          precinct: tree.precinct ?? undefined,
          latitude: String(tree.latitude),
          longitude: String(tree.longitude),
        }),
        autoTrack: Date.now().toString(),
      },
    });
  }

  /*Auto Track
   */
  useEffect(() => {
    if (!selectedTree.autoTrack || !hasSelectedTree) {
      return;
    }

    if (tracking) {
      stopTracking();
    }

    startTracking();

    router.setParams({ autoTrack: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTree.autoTrack]);

  /* Search by Image */
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
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#edf3ef',
        padding: 12,
        boxSizing: 'border-box', }}>
      <div style={{ width: '100%',
          height: '100%',
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative'}}>
        {loading && <LoadingScreen />}

        <Map
          ref={mapRef}
          onLoad={() => setMapReady(true)}
          initialViewState={{
            latitude: MELBOURNE_CENTER.latitude,
            longitude: MELBOURNE_CENTER.longitude,
            zoom: 13,
          }}
          mapStyle={mapStyle}
          style={{ width: '100%', height: '100%' }}
        >
          {trees.map((tree, index) => (
            <Marker
              key={`${tree.id}-${index}`}
              latitude={tree.latitude}
              longitude={tree.longitude}
              anchor="bottom"
            >
              <img
                src={require('../../../assets/images/location_pin_lightmode.png')}
                alt={tree.commonName ?? 'Unknown tree'}
                style={styles.marker}
              />
            </Marker>
          ))}

          {/* SELECTED TREE MARKER (destination) */}
          {hasSelectedTree && (
            <Marker
              latitude={Number(selectedTree.latitude)}
              longitude={Number(selectedTree.longitude)}
              anchor="bottom"
              style={{ zIndex: 999 }}
            >
              <img
                src={require('../../../assets/images/destination_pin.png')}
                alt={selectedTree.commonName ?? 'Selected tree'}
                style={{ width: 60, height: 60 }}
              />
            </Marker>
          )}

          {/* WALKING ROUTE TO SELECTED TREE */}
          {routeCoords.length > 0 && (
            <Source
              type="geojson"
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoords.map((coord) => [
                    coord.longitude,
                    coord.latitude,
                  ]),
                },
              }}
            >
              <Layer
                id="route-outline"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': 'rgba(230, 57, 129, 0.35)',
                  'line-width': 8,
                }}
              />
              <Layer
                id="route-line"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#d14f85',
                  'line-width': 4,
                }}
              />
            </Source>
          )}

          {/* CUSTOM USER LOCATION MARKER */}
          {userLocation && (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              anchor="center"
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${heading}deg)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderBottom: '32px solid rgba(32, 138, 239, 0.35)',
                  }}
                />
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: '#208AEF',
                    border: '3px solid white',
                  }}
                />
              </div>
            </Marker>
          )}
        </Map>

        <CherryBlossomBorder mode={flowerMode} />

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
            onTrackPress={tracking ? stopTracking : startTracking}
            onDetailsPress={backToTreeDetails}
            onClose={closeSelectedTree}
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
            onTrackResult={trackFromList}
          />
        )}
      </div>
    </div>
  );
  
}
