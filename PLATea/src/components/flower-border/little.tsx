import React from 'react';
import { View } from 'react-native';
import { CherryBlossom, FlowerBorderVariantProps, styles } from './shared';

const scales = [1.15, 2, 2.5, 1.45, 0.9, 2, 1.3];
const rotations = [-24, 14, 32, -10, 20, -45, 8];

export const LittleFlowerBorder: React.FC<FlowerBorderVariantProps> = ({ width }) => {
  const spacing = 72;
  const count = Math.floor(width / spacing) || 0;
  const edgeOffset = -18;

  return (
    <>
      <View style={[styles.row, { top: edgeOffset }]}>
        {[...Array(count)].map((_, index) => (
          <CherryBlossom
            key={`little-top-${index}`}
            scale={scales[index % scales.length]}
            rotation={rotations[index % rotations.length]}
          />
        ))}
      </View>
      <View style={[styles.row, { bottom: edgeOffset }]}>
        {[...Array(count)].map((_, index) => (
          <CherryBlossom
            key={`little-bottom-${index}`}
            scale={scales[(index + 2) % scales.length]}
            rotation={rotations[(index + 2) % rotations.length]}
          />
        ))}
      </View>
    </>
  );
};
