import { Polyline } from 'react-native-maps';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Props = {
  coordinates: Coordinate[];
};

export default function RouteFinding({ coordinates }: Props) {
  if (coordinates.length === 0) return null;

  return (
    <>
    <Polyline
        coordinates={coordinates}
        strokeWidth={8}
        strokeColor="rgba(230, 57, 129, 0.35)"
    />
    <Polyline
      coordinates={coordinates}
      strokeWidth={4}
      strokeColor="#d14f85"
    />
    </>
  );
}