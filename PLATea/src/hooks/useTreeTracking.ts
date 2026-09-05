import {
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
} from 'react-native';

import MapView from 'react-native-maps';

import * as Location from 'expo-location';

import {
  calculateDistance,
} from '@/utils/distance';

type Props = {
  mapRef: RefObject<MapView | null>;
  treeLatitude?: string;
  treeLongitude?: string;
};

export function useTreeTracking({
  mapRef,
  treeLatitude,
  treeLongitude,
}: Props) {
  const [tracking, setTracking] =
    useState(false);

  const [distance, setDistance] =
    useState<number | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(
      null
    );

  const headingSubscription =
    useRef<Location.LocationSubscription | null>(
      null
    );

  async function startTracking() {
    if (
      !treeLatitude ||
      !treeLongitude
    ) {
      return;
    }

    const treeLat =
      Number(treeLatitude);

    const treeLng =
      Number(treeLongitude);

    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (
      permission.status !==
      'granted'
    ) {
      Alert.alert(
        'Location permission required',
        'PLATea needs your location to track this tree.'
      );

      return;
    }

    setTracking(true);

    const current =
      await Location.getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.High,
      });

    updateUserPosition(
      current.coords.latitude,
      current.coords.longitude,
      treeLat,
      treeLng
    );

    headingSubscription.current =
      await Location.watchHeadingAsync(
        (heading) => {
          const direction =
            heading.trueHeading >= 0
              ? heading.trueHeading
              : heading.magHeading;

          mapRef.current?.animateCamera(
            {
              heading: direction,
            },
            {
              duration: 250,
            }
          );
        }
      );

    locationSubscription.current =
      await Location.watchPositionAsync(
        {
          accuracy:
            Location.Accuracy.High,
          distanceInterval: 3,
          timeInterval: 1000,
        },
        (location) => {
          updateUserPosition(
            location.coords.latitude,
            location.coords.longitude,
            treeLat,
            treeLng
          );
        }
      );
  }

  function updateUserPosition(
    userLat: number,
    userLng: number,
    treeLat: number,
    treeLng: number
  ) {
    setDistance(
      calculateDistance(
        userLat,
        userLng,
        treeLat,
        treeLng
      )
    );

    mapRef.current?.animateCamera(
      {
        center: {
          latitude: userLat,
          longitude: userLng,
        },

        zoom: 17,
      },
      {
        duration: 500,
      }
    );
  }

  function stopTracking() {
    locationSubscription.current?.remove();
    headingSubscription.current?.remove();

    locationSubscription.current = null;
    headingSubscription.current = null;

    setTracking(false);
  }

  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
      headingSubscription.current?.remove();
    };
  }, []);

  return {
    tracking,
    distance,
    startTracking,
    stopTracking,
  };
}