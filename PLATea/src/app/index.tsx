// src/app/index.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { fetchMelbourneTrees, Tree, Bounds } from '../services/cityOfMelbourne';
import { CherryBlossomBorder, FlowerBorderMode } from '../components/flower-border';
import { FlowerBorderControls } from '../components/flower-border-controls';
import { LoadingScreen } from '../components/loading-screen';

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
  const [flowerMode, setFlowerMode] = useState<FlowerBorderMode>('lots');

  useEffect(() => {
    async function loadTrees() {
      setLoading(true);
      const startedAt = Date.now();
      const results = await fetchMelbourneTrees(MELBOURNE_BOUNDS, 1000);
      const remainingTime = Math.max(0, 5000 - (Date.now() - startedAt));
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setTrees(results);
      setLoading(false);
    }
    loadTrees();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {loading && (
          <LoadingScreen />
        )}
        <MapView style={{ flex: 1 }} initialRegion={INITIAL_REGION}>
          {trees.map((tree, index) => (
            <Marker
              key={`${tree.id}-${index}`}
              pinColor="#FF1493"
              coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
              title={tree.commonName ?? 'Unknown tree'}
              description={tree.scientificName ?? undefined}
            />
          ))}
        </MapView>
        <FlowerBorderControls mode={flowerMode} onChange={setFlowerMode} />
        <CherryBlossomBorder mode={flowerMode} />
      </View>
    </View>
  );
}
