// src/app/(tabs)/index.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import MapView, {
  Marker,
  Region,
} from 'react-native-maps';

import { useLocalSearchParams } from 'expo-router';

import {
  fetchMelbourneTrees,
  Tree,
  Bounds,
} from '../../services/cityOfMelbourne';


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

  // Stores all trees loaded from Melbourne API
  const [trees, setTrees] = useState<Tree[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  // Lets us control the map from code
  const mapRef = useRef<MapView>(null);

  // Makes sure the map is ready before
  // trying to move it
  const [mapReady, setMapReady] =
    useState(false);


  /*
   * These values are sent from
   * tree-details.tsx when the user
   * presses "Locate on Map".
   */
  const {
    latitude,
    longitude,
    treeName,
    focusKey,
  } = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
    treeName?: string;
    focusKey?: string;
  }>();


  /*
   * Load Melbourne trees when
   * the map screen first opens.
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
   * If the user came here by pressing
   * "Locate on Map", zoom to that tree.
   */
  useEffect(() => {
    if (
      !mapReady ||
      !latitude ||
      !longitude
    ) {
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    // Make sure coordinates are valid
    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,

        // Smaller delta = more zoomed in
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      700
    );

  }, [
    latitude,
    longitude,
    focusKey,
    mapReady,
  ]);


  return (
    <View style={styles.container}>

      {/* LOADING MESSAGE */}
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
        onMapReady={() => setMapReady(true)}
      >

        {/* NORMAL MELBOURNE TREE MARKERS */}
        {trees.map((tree, index) => (
          <Marker
            key={`${tree.id}-${index}`}
            coordinate={{
              latitude: tree.latitude,
              longitude: tree.longitude,
            }}
            title={
              tree.commonName ??
              'Unknown tree'
            }
            description={
              tree.scientificName ??
              undefined
            }
          />
        ))}


        {/*
         * SELECTED TREE
         *
         * This marker appears when the
         * user presses "Locate on Map"
         * from Tree Details.
         */}
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude),
            }}
            title={
              treeName ??
              'Selected tree'
            }
            description="Selected from search"
          />
        )}

      </MapView>

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
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
});