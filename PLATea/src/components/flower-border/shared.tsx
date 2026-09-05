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
  topRightCorner: {
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
  },
  cluster: {
    position: 'absolute',
    width: 200,
    height: 200,
    zIndex: 10,
  },
  topRightCluster: {
    top: -46,
    right: -40,
  },
  bottomLeftCluster: {
    bottom: -40,
    left: -40,
    transform: [{ rotate: '180deg' }],
  },
  clusterFlowerOne: {
    position: 'absolute',
    top: 30,
    right: 120,
  },
  clusterFlowerTwo: {
    position: 'absolute',
    top: 30,
    right: 100,
  },
  clusterFlowerThree: {
    position: 'absolute',
    top: 130,
    right: 0,
  },
});
