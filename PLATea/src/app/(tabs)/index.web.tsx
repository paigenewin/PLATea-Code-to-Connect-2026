import 'maplibre-gl/dist/maplibre-gl.css';

import React, { useEffect, useState } from 'react';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Marker } from 'react-map-gl/maplibre';
import { CherryBlossomBorder, FlowerBorderMode } from '../../components/flower-border';
import { LoadingScreen } from '../../components/loading-screen';
import { Bounds, fetchMelbourneTrees, Tree } from '../../services/cityOfMelbourne';
import { styles } from '../../styles/index.web';
import { useColorScheme } from 'react-native';

// Darkmode and lightmode

const LIGHTMODE_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const DARKMODE_STYLE =  'https://tiles.openfreemap.org/styles/fiord';
const colorScheme = useColorScheme();
const mapStyle = colorScheme === 'dark' ? DARKMODE_STYLE : LIGHTMODE_STYLE;

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
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [flowerMode] = useState<FlowerBorderMode>('corners');

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
        </Map>

        <CherryBlossomBorder mode={flowerMode} />
      </div>
    </div>
  );
  
}
