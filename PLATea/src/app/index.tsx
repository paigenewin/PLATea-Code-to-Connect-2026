// src/app/index.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { fetchMelbourneTrees, Tree, Bounds } from '../services/cityOfMelbourne';

const MELBOURNE_BOUNDS: Bounds = {
  minLat: -37.85,
  maxLat: -37.78,
  minLng: 144.9,
  maxLng: 144.99,
};

const INITIAL_REGION: Region = {
  latitude: -37.8136,
  longitude: 144.9631,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTrees() {
      setLoading(true);
      const results = await fetchMelbourneTrees(MELBOURNE_BOUNDS, 100);
      setTrees(results);
      setLoading(false);
    }
    loadTrees();
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text>Loading trees...</Text>
        </View>
      )}
      <MapView style={styles.map} initialRegion={INITIAL_REGION}>
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
            title={tree.commonName ?? 'Unknown tree'}
            description={tree.scientificName ?? undefined}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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