import 'maplibre-gl/dist/maplibre-gl.css';

import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import { CherryBlossomBorder, FlowerBorderMode } from '../../components/flower-border';
import { LoadingScreen } from '../../components/loading-screen';
import { Bounds, fetchMelbourneTrees, Tree } from '../../services/cityOfMelbourne';
import { styles } from '../../styles/index.web';

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

const RASTER_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster' as const,
      source: 'osm',
    },
  ],
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
          mapStyle={RASTER_STYLE}
          style={{ width: '100%', height: '100%' }}
          onLoad={(event) => {
            const map = event.target;
            map.on('style.load',() => {
                map.setPaintProperty('water', 'fill-color', '#a9d2fc');
                map.setPaintProperty('')
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
