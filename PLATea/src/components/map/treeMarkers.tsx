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
    </>
  );
}