import { Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

type Props = {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
};

export default function DestinationMarker({
  latitude,
  longitude,
  title,
  description,
}: Props) {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 1 }}
      title={title ?? 'Selected tree'}
      description={description}
      zIndex={999}
    >
      <Image
        source={require('../../../assets/images/destination_pin.png')}
        style={styles.pin}
        resizeMode="contain"
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 80,
    height: 80,
  },
});
