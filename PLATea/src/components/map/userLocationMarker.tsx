import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

type Props = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  heading: number;
};

export default function UserLocationMarker({
  coordinate,
  heading,
}: Props) {
  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      zIndex={1000}
    >
      <View
        style={[
          styles.userMarker,
          { transform: [{ rotate: `${heading}deg` }] },
        ]}
      >
        {/* DIRECTION CONE */}
        <View style={styles.directionArrow} />

        {/* USER BLUE DOT */}
        <View style={styles.userDot} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  /*
   * Entire custom user marker.
   *
   * This whole component rotates
   * according to the phone heading.
   */
  userMarker: {
    width: 60,
    height: 60,

    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
   * Direction cone.
   *
   * This sits above the blue dot
   * and points in the direction
   * the phone is facing.
   */
  directionArrow: {
    position: 'absolute',
    top: 0,

    width: 0,
    height: 0,

    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 32,

    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',

    borderBottomColor: 'rgba(32, 138, 239, 0.35)',
  },

  /*
   * User location dot.
   */
  userDot: {
    width: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor: '#208AEF',

    borderWidth: 3,
    borderColor: 'white',
  },
});
