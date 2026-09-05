import { RefObject, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { calculateDistance } from '@/utils/distance';


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

  const [userLocation, setUserLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  const [heading, setHeading] =
    useState(0);


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


    if (
      Number.isNaN(treeLat) ||
      Number.isNaN(treeLng)
    ) {
      return;
    }


    const permission =
      await Location.requestForegroundPermissionsAsync();


    if (
      permission.status !== 'granted'
    ) {
      Alert.alert(
        'Location permission required',
        'PLATea needs your location to track this tree.'
      );

      return;
    }


    setTracking(true);


    /*
     * Get the user's current position
     * immediately.
     */
    const current =
      await Location.getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.High,
      });


    const currentUserLocation = {
      latitude:
        current.coords.latitude,

      longitude:
        current.coords.longitude,
    };


    setUserLocation(
      currentUserLocation
    );


    setDistance(
      calculateDistance(
        currentUserLocation.latitude,
        currentUserLocation.longitude,
        treeLat,
        treeLng
      )
    );


    /*
     * Move the map to the user
     * when tracking starts.
     */
    mapRef.current?.animateCamera(
      {
        center:
          currentUserLocation,

        zoom: 17,
      },
      {
        duration: 700,
      }
    );


    /*
     * Track which direction
     * the phone is facing.
     */
    headingSubscription.current =
      await Location.watchHeadingAsync(
        (headingData) => {

          const direction =
            headingData.trueHeading >= 0
              ? headingData.trueHeading
              : headingData.magHeading;


          setHeading(direction);


          /*
           * Rotate the map in the same
           * direction as the phone.
           */
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


    /*
     * Track the user's live GPS
     * position while they move.
     */
    locationSubscription.current =
      await Location.watchPositionAsync(
        {
          accuracy:
            Location.Accuracy.High,

          distanceInterval: 3,

          timeInterval: 1000,
        },

        (location) => {

          const newUserLocation = {
            latitude:
              location.coords.latitude,

            longitude:
              location.coords.longitude,
          };


          setUserLocation(
            newUserLocation
          );


          /*
           * Recalculate distance
           * from the user to the tree.
           */
          setDistance(
            calculateDistance(
              newUserLocation.latitude,
              newUserLocation.longitude,
              treeLat,
              treeLng
            )
          );


          /*
           * Keep the map following
           * the user's live location.
           */
          mapRef.current?.animateCamera(
            {
              center:
                newUserLocation,

              zoom: 17,
            },
            {
              duration: 500,
            }
          );
        }
      );
  }


  function stopTracking() {

    locationSubscription.current?.remove();

    headingSubscription.current?.remove();


    locationSubscription.current =
      null;

    headingSubscription.current =
      null;


    setTracking(false);
  }


  /*
   * Stop tracking automatically
   * if this component is removed.
   */
  useEffect(() => {
    return () => {

      locationSubscription.current?.remove();

      headingSubscription.current?.remove();

    };
  }, []);

  return {
    tracking,

    distance,

    userLocation,

    heading,

    startTracking,

    stopTracking,
  };
}