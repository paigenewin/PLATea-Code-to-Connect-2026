import React, { useState } from 'react';
import { Image, View, StyleSheet, LayoutChangeEvent } from 'react-native';

const FLOWER_SCALES = [1.15, 2, 2.5, 1.45, 0.9, 2, 1.3];
const FLOWER_ROTATIONS = [-24, 14, 32, -10, 20, -45, 8];

const CherryBlossom = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number }) => (
  <Image
    source={require('../../assets/images/cherryblossom.png')}
    style={[styles.blossom, { transform: [{ scale }, { rotate: `${rotation}deg` }] }]}
    resizeMode="contain"
  />
);

export const CherryBlossomBorder: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const iconSizeWithSpacing = 30;
  const topBottomCount = Math.floor(dimensions.width / iconSizeWithSpacing) || 0;
  const leftRightCount = Math.floor((dimensions.height - iconSizeWithSpacing * 2) / iconSizeWithSpacing) || 0;

  return (
    <View style={styles.container} onLayout={onLayout} pointerEvents="none">
      {dimensions.width > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={[styles.row, { top: -4 }]}>
            {[...Array(topBottomCount)].map((_, i) => (
              <CherryBlossom
                key={`top-${i}`}
                scale={FLOWER_SCALES[i % FLOWER_SCALES.length]}
                rotation={FLOWER_ROTATIONS[i % FLOWER_ROTATIONS.length]}
              />
            ))}
          </View>

          <View style={[styles.row, { bottom: -4 }]}>
            {[...Array(topBottomCount)].map((_, i) => (
              <CherryBlossom
                key={`bottom-${i}`}
                scale={FLOWER_SCALES[(i + 2) % FLOWER_SCALES.length]}
                rotation={FLOWER_ROTATIONS[(i + 2) % FLOWER_ROTATIONS.length]}
              />
            ))}
          </View>

          <View style={[styles.column, { left: -4, top: iconSizeWithSpacing }]}>
            {[...Array(leftRightCount)].map((_, i) => (
              <CherryBlossom
                key={`left-${i}`}
                scale={FLOWER_SCALES[(i + 1) % FLOWER_SCALES.length]}
                rotation={FLOWER_ROTATIONS[(i + 1) % FLOWER_ROTATIONS.length]}
              />
            ))}
          </View>

          <View style={[styles.column, { right: -4, top: iconSizeWithSpacing }]}>
            {[...Array(leftRightCount)].map((_, i) => (
              <CherryBlossom
                key={`right-${i}`}
                scale={FLOWER_SCALES[(i + 3) % FLOWER_SCALES.length]}
                rotation={FLOWER_ROTATIONS[(i + 3) % FLOWER_ROTATIONS.length]}
              />
            ))}
          </View>

          <View style={styles.topRightCorner}>
            <CherryBlossom scale={5} rotation={26} />
          </View>

          <View style={styles.bottomLeftCorner}>
            <CherryBlossom scale={5} rotation={-26} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
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
  topRightCorner: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
});
