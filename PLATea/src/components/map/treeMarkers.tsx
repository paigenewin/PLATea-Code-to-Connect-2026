import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

import { Tree } from '@/services/cityOfMelbourne';

type Props = {
  trees: Tree[];
};

export default function TreeMarkers({
  trees,
}: Props) {
  return (
    <>
      {trees.map((tree, index) => (
        <Marker
          key={`${tree.id}-${index}`}
          coordinate={{
            latitude: tree.latitude,
            longitude: tree.longitude,
          }}
          anchor={{ x: 0.5, y: 1 }}
          title={
            tree.commonName ??
            'Unknown tree'
          }
          description={
            tree.scientificName ??
            undefined
          }
        >
          <Image
            source={require('../../../assets/images/location_pin_lightmode.png')}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Marker>
      ))}
    </>
  );
}