import 'maplibre-gl/dist/maplibre-gl.css';

import React, { useEffect, useState } from 'react';
import { setWorkerUrl } from 'maplibre-gl';
import Map, { Marker } from 'react-map-gl/maplibre';
import { CherryBlossomBorder, FlowerBorderMode } from '../../components/flower-border';
import { LoadingScreen } from '../../components/loading-screen';
import { Bounds, fetchMelbourneTrees, Tree } from '../../services/cityOfMelbourne';
import { styles } from '../../styles/index.web';


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

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

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
          mapStyle={OPENFREEMAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => {
            const map = event.target;
            map.on('style.load',() => {
                map.setPaintProperty('water', 'fill-color', '#a9d2fc');
                map.setPaintProperty('background', 'background-color', '#ff5884');
            });
          }}
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
