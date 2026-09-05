import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { formatDistance } from '@/utils/distance';

type SelectedTree = {
  commonName?: string;
  scientificName?: string;
};

type Props = {
  tree: SelectedTree;
  distance: number | null;
  tracking: boolean;
  onTrackPress: () => void;
  onDetailsPress: () => void;
};

export default function SelectedTreeCard({
  tree,
  distance,
  tracking,
  onTrackPress,
  onDetailsPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.treeInfo}>
          <Text style={styles.name}>
            {tree.commonName ||
              'Unknown tree'}
          </Text>

          <Text style={styles.scientific}>
            {tree.scientificName}
          </Text>
        </View>

        {distance !== null && (
          <Text style={styles.distance}>
            {formatDistance(distance)}
          </Text>
        )}
      </View>

      {tracking && (
        <Text style={styles.tracking}>
          Live location tracking
        </Text>
      )}

      <View style={styles.buttons}>
        <Pressable
          style={[
            styles.trackButton,
            tracking &&
              styles.stopButton,
          ]}
          onPress={onTrackPress}
        >
          <Text style={styles.trackText}>
            {tracking
              ? 'Stop'
              : 'Track'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.detailsButton}
          onPress={onDetailsPress}
        >
          <Text style={styles.detailsText}>
            Tree Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 92,

    backgroundColor: 'white',

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 12,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  treeInfo: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
  },

  scientific: {
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.55,
    marginTop: 2,
  },

  distance: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },

  tracking: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 5,
  },

  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  trackButton: {
    flex: 1,
    height: 40,

    backgroundColor: '#208AEF',

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  stopButton: {
    backgroundColor: '#555555',
  },

  trackText: {
    color: 'white',
    fontWeight: '700',
  },

  detailsButton: {
    flex: 1,
    height: 40,

    borderWidth: 1,
    borderColor: '#DDDDDD',

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsText: {
    color: '#208AEF',
    fontWeight: '600',
  },
});