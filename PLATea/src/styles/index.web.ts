import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 12,
    backgroundColor: '#edf3ef',
  },
  mapFrame: {
    flex: 1,
    overflow: 'hidden' as const,
    borderRadius: 22,
    backgroundColor: '#c5d9c7',
  },
  mapSurface: {
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: '#b9d3bd',
  },
  water: {
    position: 'absolute' as const,
    left: '9%' as const,
    top: '-8%' as const,
    width: '34%' as const,
    height: '125%' as const,
    backgroundColor: '#a8d3d2',
    transform: [{ rotate: '16deg' }],
    opacity: 0.8,
  },
  land: {
    position: 'absolute' as const,
    left: '34%' as const,
    top: '10%' as const,
    width: '48%' as const,
    height: '72%' as const,
    borderRadius: 140,
    backgroundColor: '#d8e1bb',
    opacity: 0.55,
  },
  marker: {
    width: 30,
    height: 40,
  },
  loadingOverlay: {
    position: 'absolute' as const,
    top: 20,
    alignSelf: 'center' as const,
    zIndex: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  loadingFlower: {
    width: 48,
    height: 48,
    alignSelf: 'center' as const,
  },
  loadingTitle: {
    alignSelf: 'center' as const,
    color: '#e85a94',
    fontSize: 22,
    fontWeight: '700' as const,
  },
  searchBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      zIndex: 30,

      backgroundColor: 'white',
      borderRadius: 14,

      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 30,
  },
}

);
