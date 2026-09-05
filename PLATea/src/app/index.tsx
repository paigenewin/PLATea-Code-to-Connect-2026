// src/app/index.tsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { fetchMelbourneTrees, Tree, Bounds } from '../services/cityOfMelbourne';
import { CherryBlossomBorder } from '../components/cherry-blossom-border';

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
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTrees() {
      setLoading(true);
      const results = await fetchMelbourneTrees(MELBOURNE_BOUNDS, 1000);
      setTrees(results);
      setLoading(false);
    }
    loadTrees();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {loading && (
          <View
            style={{
              position: 'absolute',
              top: 20,
              alignSelf: 'center',
              zIndex: 1,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 8,
            }}
          >
            <ActivityIndicator size="large" />
            <Text>Loading trees...</Text>
          </View>
        )}
        <MapView style={{ flex: 1 }} initialRegion={INITIAL_REGION}>
          {trees.map((tree, index) => (
            <Marker
              key={`${tree.id}-${index}`}
              coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
              title={tree.commonName ?? 'Unknown tree'}
              description={tree.scientificName ?? undefined}
            />
          ))}
        </MapView>
        <CherryBlossomBorder />
      </View>
    </View>
  );
}
