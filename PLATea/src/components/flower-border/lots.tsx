import React from 'react';
import { View } from 'react-native';
import { CherryBlossom, FlowerBorderVariantProps, styles } from './shared';

const scales = [1.15, 2, 2.5, 1.45, 0.9, 2, 1.3];
const rotations = [-24, 14, 32, -10, 20, -45, 8];
const innerScales = [0.55, 0.72, 0.62, 0.8];
const innerRotations = [-16, 24, -30, 12];

export const LotsFlowerBorder: React.FC<FlowerBorderVariantProps> = ({ width, height }) => {
  const spacing = 30;
  const edgeOffset = -26;
  const count = Math.floor(width / spacing) || 0;
  const sideCount = Math.floor((height - spacing * 2) / spacing) || 0;
  const innerSpacing = 86;
  const innerCount = Math.floor(width / innerSpacing) || 0;
  const innerSideCount = Math.floor((height - innerSpacing) / innerSpacing) || 0;

  return (
    <>
      <View style={[styles.row, { top: edgeOffset }]}>
        {[...Array(count)].map((_, index) => (
          <CherryBlossom
            key={`lots-top-${index}`}
            scale={scales[index % scales.length]}
            rotation={rotations[index % rotations.length]}
          />
        ))}
      </View>
      <View style={[styles.row, { bottom: edgeOffset }]}>
        {[...Array(count)].map((_, index) => (
          <CherryBlossom
            key={`lots-bottom-${index}`}
            scale={scales[(index + 2) % scales.length]}
            rotation={rotations[(index + 2) % rotations.length]}
          />
        ))}
      </View>
      <View style={[styles.column, { left: edgeOffset, top: spacing }]}>
        {[...Array(sideCount)].map((_, index) => (
          <CherryBlossom
            key={`lots-left-${index}`}
            scale={scales[(index + 1) % scales.length]}
            rotation={rotations[(index + 1) % rotations.length]}
          />
        ))}
      </View>
      <View style={[styles.column, { right: edgeOffset, top: spacing }]}>
        {[...Array(sideCount)].map((_, index) => (
          <CherryBlossom
            key={`lots-right-${index}`}
            scale={scales[(index + 3) % scales.length]}
            rotation={rotations[(index + 3) % rotations.length]}
          />
        ))}
      </View>
      <View style={[styles.innerLayer, styles.innerRow, { top: 12 }]}>
        {[...Array(innerCount)].map((_, index) => (
          <CherryBlossom
            key={`inner-top-${index}`}
            scale={innerScales[index % innerScales.length]}
            rotation={innerRotations[index % innerRotations.length]}
          />
        ))}
      </View>
      <View style={[styles.innerLayer, styles.innerRow, { bottom: 12 }]}>
        {[...Array(innerCount)].map((_, index) => (
          <CherryBlossom
            key={`inner-bottom-${index}`}
            scale={innerScales[(index + 2) % innerScales.length]}
            rotation={innerRotations[(index + 2) % innerRotations.length]}
          />
        ))}
      </View>
      <View style={[styles.innerLayer, styles.innerColumn, { left: 12, top: innerSpacing }]}>
        {[...Array(innerSideCount)].map((_, index) => (
          <CherryBlossom
            key={`inner-left-${index}`}
            scale={innerScales[(index + 1) % innerScales.length]}
            rotation={innerRotations[(index + 1) % innerRotations.length]}
          />
        ))}
      </View>
      <View style={[styles.innerLayer, styles.innerColumn, { right: 12, top: innerSpacing }]}>
        {[...Array(innerSideCount)].map((_, index) => (
          <CherryBlossom
            key={`inner-right-${index}`}
            scale={innerScales[(index + 3) % innerScales.length]}
            rotation={innerRotations[(index + 3) % innerRotations.length]}
          />
        ))}
      </View>
    </>
  );
};
