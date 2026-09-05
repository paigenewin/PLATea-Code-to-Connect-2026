import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';

import MapView, {
  Marker,
  Region,
} from 'react-native-maps';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import * as Location from 'expo-location';

import {
  fetchMelbourneTrees,
  Tree,
  Bounds,
} from '../../services/cityOfMelbourne';


const MELBOURNE_BOUNDS: Bounds = {
  minLat: -37.97,
  maxLat: -37.7,
  minLng: 144.8,
  maxLng: 145.12,
};


const INITIAL_REGION: Region = {
  latitude: -37.8136,
  longitude: 144.9631,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};


export default function MapScreen() {
  const [trees, setTrees] =
    useState<Tree[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [mapReady, setMapReady] =
    useState(false);

  const [tracking, setTracking] =
    useState(false);

  const [distance, setDistance] =
    useState<number | null>(null);


  const mapRef =
    useRef<MapView>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(
      null
    );

  /*
   * Tree information received from
   * Tree Details when Locate is pressed.
   */
  const selectedTree =
    useLocalSearchParams<{
      id?: string;
      commonName?: string;
      scientificName?: string;
      genus?: string;
      family?: string;
      precinct?: string;
      locationType?: string;
      datePlanted?: string;
      ageDescription?: string;
      dbh?: string;
      latitude?: string;
      longitude?: string;
      focusKey?: string;
    }>();


  /*
   * Load normal Melbourne tree markers.
   */
  useEffect(() => {
    async function loadTrees() {
      setLoading(true);

      const results =
        await fetchMelbourneTrees(
          MELBOURNE_BOUNDS,
          1000
        );

      setTrees(results);

      setLoading(false);
    }

    loadTrees();
  }, []);


  /*
   * When Locate is pressed from
   * Tree Details, zoom to that tree.
   */
  useEffect(() => {
    if (
      !mapReady ||
      !selectedTree.latitude ||
      !selectedTree.longitude
    ) {
      return;
    }

    const latitude =
      Number(selectedTree.latitude);

    const longitude =
      Number(selectedTree.longitude);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }


    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,

        // Zoom in quite closely
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      700
    );

  }, [
    mapReady,
    selectedTree.latitude,
    selectedTree.longitude,
    selectedTree.focusKey,
  ]);


  /*
   * Start live distance tracking.
   */
  async function startTracking() {
    if (
      !selectedTree.latitude ||
      !selectedTree.longitude
    ) {
      return;
    }


    const treeLatitude =
      Number(selectedTree.latitude);

    const treeLongitude =
      Number(selectedTree.longitude);


    const permission =
      await Location.requestForegroundPermissionsAsync();


    if (permission.status !== 'granted') {
      Alert.alert(
        'Location permission required',
        'PLATea needs your location to track your distance from this tree.'
      );

      return;
    }


    setTracking(true);


    /*
     * Get immediate position first.
     */
    const current =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });


    setDistance(
      calculateDistance(
        current.coords.latitude,
        current.coords.longitude,
        treeLatitude,
        treeLongitude
      )
    );

    mapRef.current?.animateCamera(
      {
        center: {
          latitude:
            current.coords.latitude,

          longitude:
            current.coords.longitude,
        },

        zoom: 17,
      },

      {
        duration: 700,
      }
    );


    /*
     * Then continue updating as
     * the user moves.
     */
    locationSubscription.current =
    await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 3,
      timeInterval: 1000,
    },

    (location) => {
      const userLatitude =
        location.coords.latitude;

      const userLongitude =
        location.coords.longitude;


      // Update distance to selected tree
      const newDistance =
        calculateDistance(
          userLatitude,
          userLongitude,
          treeLatitude,
          treeLongitude
        );

      setDistance(newDistance);


      // Follow the user's live location
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: userLatitude,
            longitude: userLongitude,
          },

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

    locationSubscription.current = null;

    setTracking(false);
  }


  /*
   * Reopen the details page for
   * the selected tree.
   */
  function backToTreeDetails() {
    router.push({
      pathname: '/tree-details',

      params: {
        id: selectedTree.id ?? '',
        commonName:
          selectedTree.commonName ?? '',
        scientificName:
          selectedTree.scientificName ?? '',
        genus:
          selectedTree.genus ?? '',
        family:
          selectedTree.family ?? '',
        precinct:
          selectedTree.precinct ?? '',
        locationType:
          selectedTree.locationType ?? '',
        datePlanted:
          selectedTree.datePlanted ?? '',
        ageDescription:
          selectedTree.ageDescription ?? '',
        dbh:
          selectedTree.dbh ?? '',
        latitude:
          selectedTree.latitude ?? '',
        longitude:
          selectedTree.longitude ?? '',
      },
    });
  }


  /*
   * Stop GPS when screen/component
   * is removed.
   */
  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
    };
  }, []);


  const hasSelectedTree =
    Boolean(
      selectedTree.latitude &&
      selectedTree.longitude
    );


  return (
    <View style={styles.container}>

      {/* LOADING */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text>Loading trees...</Text>
        </View>
      )}


      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        onMapReady={() =>
          setMapReady(true)
        }
      >

        {/* NORMAL TREE POINTS */}
        {trees.map((tree, index) => (
          <Marker
            key={`${tree.id}-${index}`}
            coordinate={{
              latitude: tree.latitude,
              longitude: tree.longitude,
            }}
            title={
              tree.commonName ??
              'Unknown tree'
            }
            description={
              tree.scientificName ??
              undefined
            }
          />
        ))}


        {/*
         * SPECIAL SELECTED TREE MARKER
         *
         * It appears above normal markers
         * and uses another colour so the
         * user can find it easily.
         */}
        {hasSelectedTree && (
          <Marker
            coordinate={{
              latitude:
                Number(
                  selectedTree.latitude
                ),

              longitude:
                Number(
                  selectedTree.longitude
                ),
            }}

            title={
              selectedTree.commonName ??
              'Selected tree'
            }

            description={
              selectedTree.scientificName ??
              'Selected from search'
            }

            pinColor="#208AEF"

            zIndex={999}
          />
        )}

      </MapView>


      {/*
       * SELECTED TREE POPUP
       *
       * This is deliberately large and
       * separate from the other markers.
       */}
      {hasSelectedTree && (
        <View style={styles.selectedCard}>

          <Text style={styles.selectedLabel}>
            SELECTED TREE
          </Text>

          <Text style={styles.selectedName}>
            {selectedTree.commonName ||
              'Unknown tree'}
          </Text>

          <Text style={styles.selectedScientific}>
            {selectedTree.scientificName}
          </Text>


          {/* DISTANCE */}
          <View style={styles.distanceArea}>

            <Text style={styles.distanceLabel}>
              Distance
            </Text>

            <Text style={styles.distanceText}>
              {distance === null
                ? 'Not tracking'
                : formatDistance(distance)}
            </Text>
            {tracking && (
            <Text style={styles.trackingStatus}>
                Live location tracking
            </Text>
            
)}

          </View>


          {/* TRACK BUTTON */}
          <Pressable
            style={[
              styles.trackButton,

              tracking &&
                styles.stopButton,
            ]}
            onPress={
              tracking
                ? stopTracking
                : startTracking
            }
          >
            <Text style={styles.buttonText}>
              {tracking
                ? 'Stop Tracking'
                : 'Track Distance'}
            </Text>
          </Pressable>


          {/* BACK TO DETAILS */}
          <Pressable
            style={styles.detailsButton}
            onPress={backToTreeDetails}
          >
            <Text style={styles.detailsButtonText}>
              Back to Tree Details
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}


/*
 * Calculates straight-line distance
 * between the user and the tree.
 */
function calculateDistance(
  userLat: number,
  userLng: number,
  treeLat: number,
  treeLng: number
): number {

  const earthRadius = 6371000;


  const radians = (degrees: number) =>
    degrees * (Math.PI / 180);


  const latDifference =
    radians(treeLat - userLat);

  const lngDifference =
    radians(treeLng - userLng);


  const a =
    Math.sin(latDifference / 2) ** 2 +

    Math.cos(radians(userLat)) *
      Math.cos(radians(treeLat)) *

    Math.sin(lngDifference / 2) ** 2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return earthRadius * c;
}


/*
 * 238 -> "238 m away"
 * 1320 -> "1.32 km away"
 */
function formatDistance(
  metres: number
): string {

  if (metres < 1000) {
    return `${Math.round(metres)} m away`;
  }

  return `${(metres / 1000).toFixed(2)} km away`;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },


  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },


  // Selected tree popup
  selectedCard: {
    position: 'absolute',

    left: 16,
    right: 16,

    bottom: 105,

    backgroundColor: 'white',

    borderRadius: 18,

    padding: 18,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  selectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.45,
  },

  selectedName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 5,
  },

  selectedScientific: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.6,
    marginTop: 2,
  },


  // Distance
  distanceArea: {
    marginTop: 14,
  },

  distanceLabel: {
    fontSize: 12,
    opacity: 0.5,
  },

  distanceText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 3,
  },


  // Tracking
  trackButton: {
    height: 48,

    backgroundColor: '#208AEF',

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 14,
  },

  stopButton: {
    backgroundColor: '#555555',
  },

  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },


  // Back to details
  detailsButton: {
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 6,
  },

  detailsButtonText: {
    color: '#208AEF',
    fontSize: 15,
    fontWeight: '600',
  },

  trackingStatus: {
  fontSize: 13,
  marginTop: 4,
  opacity: 0.55,
},
});