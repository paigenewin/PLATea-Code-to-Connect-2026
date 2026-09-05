import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { Bounds, fetchMelbourneTrees, Tree } from '@/services/cityOfMelbourne';
import TreeMarkers from '@/components/map/treeMarkers';
import SelectedTreeCard from '@/components/map/selectedTreeCard';
import { useTreeTracking } from '@/hooks/useTreeTracking';

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
  const [trees, setTrees] =
    useState<Tree[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [mapReady, setMapReady] =
    useState(false);


  const mapRef =
    useRef<MapView>(null);


  const selectedTree =
    useLocalSearchParams<SelectedTreeParams>();


  const {
    tracking,
    distance,
    startTracking,
    stopTracking,
  } = useTreeTracking({
    mapRef,
    treeLatitude:
      selectedTree.latitude,
    treeLongitude:
      selectedTree.longitude,
  });


  /*
   * Load Melbourne trees
   */
  useEffect(() => {
    async function loadTrees() {
      setLoading(true);

      const results =
        await fetchMelbourneTrees(
          MELBOURNE_BOUNDS,
          1000
        );

      setTrees(results);

      setLoading(false);
    }

    loadTrees();
  }, []);

  /*
   * Zoom to the tree that was selected
   * from the Search screen.
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
   * Open Tree Details again
   * from the selected-tree card.
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />

          <Text>
            Loading trees...
          </Text>
        </View>
      )}


      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}

        showsUserLocation
        showsMyLocationButton

        onMapReady={() =>
          setMapReady(true)
        }
      >

        {/* NORMAL TREE MARKERS */}
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

      </MapView>


      {/* SELECTED TREE CARD */}
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

  loadingOverlay: {
    position: 'absolute',
    top: 20,

    alignSelf: 'center',

    zIndex: 10,

    backgroundColor: 'white',

    padding: 10,

    borderRadius: 8,
  },
});