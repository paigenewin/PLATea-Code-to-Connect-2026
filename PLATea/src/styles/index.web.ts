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
      width: 376,

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
  button: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'absolute',
    zIndex: 30,
    top: 15,
    right: 20,  
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffbfdd',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 30,
  },
  loginText: {
    color: '#891032',
    fontWeight: '300' as const,
  },

  },

);
