import {useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  BloomStatus,
  fetchBloomPrediction,
} from '@/services/bloomApi';

import { treeToRouteParams } from '@/utils/treeParams';

const BLOOM_STATUS_TEXT: Record<BloomStatus, string> = {
  'blooming': 'Blooming now',
  'blooming_soon': 'Blooming soon',
  'not_in_season': 'Not in season',
  'unknown': 'Status unknown',
};
export default function TreeDetailsScreen() {

  /*
   * Tree information passed from
   * the Explore/Search screen.
   */
  const tree = useLocalSearchParams<{
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
  }>();


  /*
   * Go back to the user's
   * previous Search screen.
   */
  function backToSearch() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/explore');
    }
  }


  const [bloomStatus, setBloomStatus] =
    useState<BloomStatus | null>(null);

  const [bloomLoading, setBloomLoading] =
    useState(false);

  /*
   * Fetch the bloom prediction for this
   * tree's species from the PLATea server.
   */
  useEffect(() => {
    if (!tree.scientificName) {
      setBloomStatus(null);
      return;
    }

    let cancelled = false;
    setBloomLoading(true);

    fetchBloomPrediction(tree.scientificName)
      .then((status) => {
        if (!cancelled) setBloomStatus(status);
      })
      .catch(() => {
        if (!cancelled) setBloomStatus('unknown');
      })
      .finally(() => {
        if (!cancelled) setBloomLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tree.scientificName]);
  /*
   * Go to the Map and send this
   * tree's information with it.
   */
  function locateTree() {

    // Do nothing if this tree
    // doesn't have coordinates.
    if (!tree.latitude || !tree.longitude) {
      return;
    }


    router.dismissTo({
      pathname: '/',

      params: {
        ...treeToRouteParams(tree),

        /*
         * Makes the map react even
         * if the same tree is located
         * more than once.
         */
        focusKey:
          Date.now().toString(),
      },
    });
  }


  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >

      {/* BACK TO SEARCH */}
      <Pressable
        style={styles.backButton}
        onPress={backToSearch}
      >
        <Text style={styles.backButtonText}>
          ← Back to Search Results
        </Text>
      </Pressable>


      {/* TREE NAME */}
      <Text style={styles.commonName}>
        {tree.commonName || 'Unknown tree'}
      </Text>


      <Text style={styles.scientificName}>
        {tree.scientificName ||
          'Scientific name unavailable'}
      </Text>


      {/* BLOOM STATUS */}
      <View style={styles.bloomCard}>

        <Text style={styles.label}>
          BLOOM STATUS
        </Text>

        <Text style={styles.bloomStatus}>
          {bloomLoading
            ? 'Fetching prediction...'
            : bloomStatus
              ? BLOOM_STATUS_TEXT[bloomStatus]
              : 'Status unknown'}
        </Text>

        <Text style={styles.bloomDescription}>
          {bloomLoading
            ? 'Looking up this species’ bloom prediction.'
            : BLOOM_STATUS_TEXT[
                bloomStatus ?? 'unknown'
              ]}
        </Text>

      </View>


      {/* LOCATE BUTTON */}
      <Pressable
        style={styles.locateButton}
        onPress={locateTree}
      >
        <Text style={styles.locateButtonText}>
          Locate on Map
        </Text>
      </Pressable>


      {/* TREE INFORMATION */}
      <Text style={styles.heading}>
        Tree Information
      </Text>


      <InfoRow
        label="Genus"
        value={tree.genus}
      />


      <InfoRow
        label="Family"
        value={tree.family}
      />


      <InfoRow
        label="Precinct"
        value={tree.precinct}
      />


      <InfoRow
        label="Location"
        value={tree.locationType}
      />


      <InfoRow
        label="Date planted"
        value={tree.datePlanted}
      />


      <InfoRow
        label="Age"
        value={tree.ageDescription}
      />


      <InfoRow
        label="Diameter"
        value={
          tree.dbh
            ? `${tree.dbh} cm`
            : undefined
        }
      />


      {/* COORDINATES */}
      <Text style={styles.heading}>
        Location
      </Text>


      <InfoRow
        label="Latitude"
        value={tree.latitude}
      />


      <InfoRow
        label="Longitude"
        value={tree.longitude}
      />


      {/* COMMUNITY */}
      <Text style={styles.heading}>
        Community
      </Text>


      <View style={styles.communityCard}>

        <Text style={styles.communityText}>
          No community bloom reports yet.
        </Text>

      </View>

    </ScrollView>
  );
}


/*
 * Reusable row used for displaying
 * information about the tree.
 *
 * Example:
 *
 * Genus       Prunus
 * Family      Rosaceae
 */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {

  return (
    <View style={styles.infoRow}>

      <Text style={styles.infoLabel}>
        {label}
      </Text>


      <Text style={styles.infoValue}>
        {value || 'Unknown'}
      </Text>

    </View>
  );
}


const styles = StyleSheet.create({

  screen: {
    flex: 1,
  },


  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },


  // -------------------------
  // BACK BUTTON
  // -------------------------

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 14,
  },


  backButtonText: {
    color: '#208AEF',
    fontSize: 15,
    fontWeight: '600',
  },


  // -------------------------
  // TREE NAME
  // -------------------------

  commonName: {
    fontSize: 30,
    fontWeight: '700',
  },


  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 5,
    opacity: 0.6,
  },


  // -------------------------
  // BLOOM CARD
  // -------------------------

  bloomCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#F2F5F1',
  },


  label: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.5,
  },


  bloomStatus: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 6,
  },


  bloomDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    opacity: 0.6,
  },


  // -------------------------
  // LOCATE BUTTON
  // -------------------------

  locateButton: {
    height: 52,
    backgroundColor: '#208AEF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },


  locateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },


  // -------------------------
  // SECTION HEADINGS
  // -------------------------

  heading: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 8,
  },


  // -------------------------
  // TREE INFORMATION
  // -------------------------

  infoRow: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },


  infoLabel: {
    width: 120,
    fontSize: 15,
    opacity: 0.55,
  },


  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },


  // placeholder community card

  communityCard: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },


  communityText: {
    opacity: 0.55,
  },

});