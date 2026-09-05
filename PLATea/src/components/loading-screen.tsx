import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export const LoadingScreen: React.FC = () => (
  <View style={styles.overlay}>
    <Image
      source={require('../../assets/images/cherryblossom.png')}
      style={styles.flower}
      resizeMode="contain"
    />
    <Text style={styles.title}>PLUM</Text>
    <ActivityIndicator size="small" color="#e85a94" />
    <Text>Loading trees...</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#fff0f6',
  },
  flower: {
    width: 48,
    height: 48,
  },
  title: {
    color: '#e85a94',
    fontSize: 22,
    fontWeight: '700',
  },
});
