import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { CornerFlowerBorder } from './corners';
import { LittleFlowerBorder } from './little';
import { LotsFlowerBorder } from './lots';
import { FlowerBorderMode } from './shared';

export { FlowerBorderMode } from './shared';

interface FlowerBorderProps {
  mode?: FlowerBorderMode;
}

export const CherryBlossomBorder: React.FC<FlowerBorderProps> = ({ mode = 'lots' }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  return (
    <View style={styles.container} onLayout={onLayout} pointerEvents="none">
      {dimensions.width > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {mode === 'little' && <LittleFlowerBorder {...dimensions} />}
          {mode === 'lots' && <LotsFlowerBorder {...dimensions} />}
          {mode === 'corners' && <CornerFlowerBorder {...dimensions} />}
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
});
