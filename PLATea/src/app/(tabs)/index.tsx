import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';

import { Bounds, fetchMelbourneTrees, Tree } from '@/services/cityOfMelbourne';
import TreeMarkers from '@/components/map/treeMarkers';
import SelectedTreeCard from '@/components/map/selectedTreeCard';
import { useTreeTracking } from '@/hooks/useTreeTracking';
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

type SelectedTreeParams = {
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
};

export default function MapScreen() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [flowerMode] = useState<FlowerBorderMode>('corners');

  const mapRef = useRef<MapView>(null);

  const selectedTree =
    useLocalSearchParams<SelectedTreeParams>();

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
   * Load Melbourne trees
   */
  useEffect(() => {
    async function loadTrees() {
      setLoading(true);

      const startedAt = Date.now();

      const results =
        await fetchMelbourneTrees(
          MELBOURNE_BOUNDS,
          1000
        );

      const remainingTime = Math.max(
        0,
        5000 - (Date.now() - startedAt)
      );

      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );

      setTrees(results);
      setLoading(false);
    }

    loadTrees();
  }, []);

  /*
   * Zoom to the tree selected
   * from Search / Tree Details.
   */
  useEffect(() => {
    if (
      !mapReady ||
      !selectedTree.latitude ||
      !selectedTree.longitude
    ) {
      return;
    }

    const latitude =
      Number(selectedTree.latitude);

    const longitude =
      Number(selectedTree.longitude);


    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
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

  /*
   * Return from Map to Tree Details.
   */
  function backToTreeDetails() {
    router.push({
      pathname: '/tree-details',

      params: {
        id:
          selectedTree.id ?? '',

        commonName:
          selectedTree.commonName ?? '',

        scientificName:
          selectedTree.scientificName ?? '',

        genus:
          selectedTree.genus ?? '',

        family:
          selectedTree.family ?? '',

        precinct:
          selectedTree.precinct ?? '',

        locationType:
          selectedTree.locationType ?? '',

        datePlanted:
          selectedTree.datePlanted ?? '',

        ageDescription:
          selectedTree.ageDescription ?? '',

        dbh:
          selectedTree.dbh ?? '',

        latitude:
          selectedTree.latitude ?? '',

        longitude:
          selectedTree.longitude ?? '',
      },
    });
  }

  const hasSelectedTree =
    Boolean(
      selectedTree.latitude &&
      selectedTree.longitude
    );

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

        {/* SELECTED TREE MARKER */}
        {hasSelectedTree && (
          <Marker
            coordinate={{
              latitude:
                Number(
                  selectedTree.latitude
                ),

              longitude:
                Number(
                  selectedTree.longitude
                ),
            }}

            title={
              selectedTree.commonName ??
              'Selected tree'
            }

            description={
              selectedTree.scientificName ??
              undefined
            }

            pinColor="#208AEF"

            zIndex={999}
          />
        )}

        {/* CUSTOM USER LOCATION MARKER */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{
              x: 0.5,
              y: 0.5,
            }}
            flat
            zIndex={1000}
          >

            <View
              style={[
                styles.userMarker,

                {
                  transform: [
                    {
                      rotate:
                        `${heading}deg`,
                    },
                  ],
                },
              ]}
            >

              {/* DIRECTION CONE */}
              <View
                style={
                  styles.directionArrow
                }
              />


              {/* USER BLUE DOT */}
              <View
                style={
                  styles.userDot
                }
              />

            </View>

          </Marker>
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

  /*
   * Entire custom user marker.
   *
   * This whole component rotates
   * according to the phone heading.
   */
  userMarker: {
    width: 60,
    height: 60,

    alignItems: 'center',
    justifyContent: 'center',
  },


  /*
   * Direction cone.
   *
   * This sits above the blue dot
   * and points in the direction
   * the phone is facing.
   */
  directionArrow: {
    position: 'absolute',
    top: 0,

    width: 0,
    height: 0,

    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 32,

    borderLeftColor:
      'transparent',

    borderRightColor:
      'transparent',

    borderBottomColor:
      'rgba(32, 138, 239, 0.35)',
  },

  /*
   * User location dot.
   */
  userDot: {
    width: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor:
      '#208AEF',

    borderWidth: 3,

    borderColor:
      'white',
  },
});