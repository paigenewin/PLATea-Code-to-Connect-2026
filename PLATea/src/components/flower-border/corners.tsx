import React from 'react';
import { View } from 'react-native';
import { CherryBlossom, FlowerBorderVariantProps, styles } from './shared';

export const CornerFlowerBorder: React.FC<FlowerBorderVariantProps> = () => (
  <>
    <View style={[styles.corner, styles.topLeftCorner]}>
      <CherryBlossom scale={3.6} rotation={26} />
    </View>
    <View style={[styles.corner, styles.bottomRightCorner]}>
      <CherryBlossom scale={3.6} rotation={-26} />
    </View>
    <View style={[styles.cluster, styles.topLeftCluster]}>
      <View style={styles.clusterFlowerOne}>
        <CherryBlossom scale={2} rotation={-18} />
      </View>
      <View style={styles.clusterFlowerTwo}>
        <CherryBlossom scale={1.6} rotation={22} />
      </View>
      <View style={styles.clusterFlowerThree}>
        <CherryBlossom scale={1.85} rotation={-34} />
      </View>
    </View>
    <View style={[styles.cluster, styles.bottomRightCluster]}>
      <View style={styles.clusterFlowerOne}>
        <CherryBlossom scale={2} rotation={18} />
      </View>
      <View style={styles.clusterFlowerTwo}>
        <CherryBlossom scale={1.6} rotation={-22} />
      </View>
      <View style={styles.clusterFlowerThree}>
        <CherryBlossom scale={2.3} rotation={34} />
      </View>
    </View>
  </>
);
