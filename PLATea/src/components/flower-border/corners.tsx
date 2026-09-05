import React from 'react';
import { View } from 'react-native';
import { CherryBlossom, FlowerBorderVariantProps, styles } from './shared';

export const CornerFlowerBorder: React.FC<FlowerBorderVariantProps> = () => (
  <>
    <View style={[styles.corner, styles.topRightCorner]}>
      <CherryBlossom scale={3.6} rotation={26} />
    </View>
    <View style={[styles.corner, styles.bottomLeftCorner]}>
      <CherryBlossom scale={3.6} rotation={-26} />
    </View>
    <View style={[styles.cluster, styles.topRightCluster]}>
      <View style={styles.clusterFlowerOne}>
        <CherryBlossom scale={2.45} rotation={-18} />
      </View>
      <View style={styles.clusterFlowerTwo}>
        <CherryBlossom scale={1.6} rotation={22} />
      </View>
      <View style={styles.clusterFlowerThree}>
        <CherryBlossom scale={1.85} rotation={-34} />
      </View>
    </View>
    <View style={[styles.cluster, styles.bottomLeftCluster]}>
      <View style={styles.clusterFlowerOne}>
        <CherryBlossom scale={2.45} rotation={18} />
      </View>
      <View style={styles.clusterFlowerTwo}>
        <CherryBlossom scale={1} rotation={-22} />
      </View>
      <View style={styles.clusterFlowerThree}>
        <CherryBlossom scale={2.3} rotation={34} />
      </View>
    </View>
  </>
);
