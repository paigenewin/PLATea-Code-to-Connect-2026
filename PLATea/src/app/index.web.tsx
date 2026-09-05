import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { CherryBlossomBorder } from '../components/cherry-blossom-border';
import { Bounds, fetchMelbourneTrees, Tree } from '../services/cityOfMelbourne';

const MELBOURNE_BOUNDS: Bounds = {
  minLat: -37.97,
  maxLat: -37.7,
  minLng: 144.8,
  maxLng: 145.12,
};

const markerColor = '#397d54';

function getMarkerPosition(tree: Tree) {
  const left = ((tree.longitude - MELBOURNE_BOUNDS.minLng) /
    (MELBOURNE_BOUNDS.maxLng - MELBOURNE_BOUNDS.minLng)) * 100;
  const top = ((MELBOURNE_BOUNDS.maxLat - tree.latitude) /
    (MELBOURNE_BOUNDS.maxLat - MELBOURNE_BOUNDS.minLat)) * 100;

  return {
    left: `${Math.max(0, Math.min(100, left))}%` as `${number}%`,
    top: `${Math.max(0, Math.min(100, top))}%` as `${number}%`,
  };
}

export default function MapScreenWeb() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

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
    <View style={styles.page}>
      <View style={styles.mapFrame}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={markerColor} />
            <Text>Loading trees...</Text>
          </View>
        )}
        <View style={styles.mapSurface}>
          <View style={styles.water} />
          <View style={styles.land} />
          {trees.map((tree, index) => (
            <View
              key={`${tree.id}-${index}`}
              accessibilityLabel={tree.commonName ?? 'Unknown tree'}
              style={[styles.marker, getMarkerPosition(tree)]}
            />
          ))}
        </View>
        <CherryBlossomBorder />
      </View>
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    padding: 12,
    backgroundColor: '#edf3ef',
  },
  mapFrame: {
    flex: 1,
    overflow: 'hidden' as const,
    borderRadius: 22,
    backgroundColor: '#c5d9c7',
  },
  mapSurface: {
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: '#b9d3bd',
  },
  water: {
    position: 'absolute' as const,
    left: '9%' as const,
    top: '-8%' as const,
    width: '34%' as const,
    height: '125%' as const,
    backgroundColor: '#a8d3d2',
    transform: [{ rotate: '16deg' }],
    opacity: 0.8,
  },
  land: {
    position: 'absolute' as const,
    left: '34%' as const,
    top: '10%' as const,
    width: '48%' as const,
    height: '72%' as const,
    borderRadius: 140,
    backgroundColor: '#d8e1bb',
    opacity: 0.55,
  },
  marker: {
    position: 'absolute' as const,
    width: 7,
    height: 7,
    marginLeft: -3,
    marginTop: -3,
    borderRadius: 4,
    backgroundColor: markerColor,
    borderWidth: 1,
    borderColor: '#f4f8e9',
  },
  loadingOverlay: {
    position: 'absolute' as const,
    top: 20,
    alignSelf: 'center' as const,
    zIndex: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
};
