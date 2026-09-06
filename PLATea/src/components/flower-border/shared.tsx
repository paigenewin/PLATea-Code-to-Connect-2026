import React from 'react';
import { Image, StyleSheet } from 'react-native';

export type FlowerBorderMode = 'little' | 'lots' | 'corners';

export interface FlowerBorderVariantProps {
  width: number;
  height: number;
}

export const CherryBlossom = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number }) => (
  <Image
    source={require('../../../assets/images/cherryblossom.png')}
    style={[styles.blossom, { transform: [{ scale }, { rotate: `${rotation}deg` }] }]}
    resizeMode="contain"
  />
);

export const styles = StyleSheet.create({
  blossom: {
    width: 52,
    height: 52,
    marginHorizontal: -5,
    marginVertical: -5,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  column: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '82%',
  },
  innerLayer: {
    opacity: 0.72,
  },
  innerRow: {
    position: 'absolute',
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerColumn: {
    position: 'absolute',
    bottom: 18,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '72%',
  },
  corner: {
    position: 'absolute',
    zIndex: 20,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
  },
  bottomRightCorner: {
    bottom: 0,
    right: -30,
  },
  cluster: {
    position: 'absolute',
    width: 200,
    height: 200,
    zIndex: 10,
  },
  /*
   * The three inner flowers below are always
   * anchored from the cluster box's right edge.
   * A cluster on the screen's left side needs a
   * 180deg spin to still hug that corner; one on
   * the right side already faces the right way.
   */
  topLeftCluster: {
    top: -40,
    left: -40,
    transform: [{ rotate: '180deg' }],
  },
  bottomRightCluster: {
    bottom: -50,
    right: -40,
  },
  clusterFlowerOne: {
    position: 'absolute',
    top: 120,
    right: 120,
  },
  clusterFlowerTwo: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  clusterFlowerThree: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
});
