import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

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
  blooming: 'Blooming now',
  blooming_soon: 'Blooming soon',
  not_in_season: 'Not in season',
  unknown: 'Status unknown',
};


export default function TreeDetailsScreen() {

  // Detect light / dark mode
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';


  // Colours used depending on device mode
  const theme = {
    background: isDark
      ? '#171512'
      : '#FFFFFF',

    primaryText: isDark
      ? '#F7F3EC'
      : '#2B2925',

    secondaryText: isDark
      ? '#E6E6E6' : '#414040',

    border: isDark
      ? '#FFFFFF20'
      : '#702C2C18',

    communityBackground: isDark
      ? '#211F1B'
      : '#EEE7DA',
  };


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
   * Go back to the Explore screen
   * (the map with the search sheet).
   */
  function backToSearch() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }


  const [bloomStatus, setBloomStatus] =
    useState<BloomStatus | null>(null);

  const [bloomError, setBloomError] =
    useState(false);

  const [bloomLoading, setBloomLoading] =
    useState(false);


  /*
   * Fetch the bloom prediction for this
   * tree's species from the PLATea server.
   */
  useEffect(() => {

    if (!tree.scientificName) {
      setBloomStatus(null);
      setBloomError(false);
      return;
    }

    let cancelled = false;

    setBloomLoading(true);
    setBloomError(false);
    setBloomStatus(null);

    fetchBloomPrediction(tree.scientificName)
      .then((status) => {

        if (!cancelled) {
          setBloomStatus(status);
        }

      })
      .catch((error) => {

        console.error(
          'Failed to fetch bloom prediction:',
          error
        );

        if (!cancelled) {
          setBloomError(true);
          setBloomStatus(null);
        }

      })
      .finally(() => {

        if (!cancelled) {
          setBloomLoading(false);
        }

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
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.background,
        },
      ]}
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
      <Text
        style={[
          styles.commonName,
          {
            color:
              theme.primaryText,
          },
        ]}
      >
        {tree.commonName || 'Unknown tree'}
      </Text>


      <Text
        style={[
          styles.scientificName,
          {
            color:
              theme.secondaryText,
          },
        ]}
      >
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
            : bloomError
              ? "Couldn't load bloom status"
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
      <Text
        style={[
          styles.heading,
          {
            color:
              theme.primaryText,
          },
        ]}
      >
        Tree Information
      </Text>


      <InfoRow
        label="Genus"
        value={tree.genus}
        theme={theme}
      />

      <InfoRow
        label="Family"
        value={tree.family}
        theme={theme}
      />

      <InfoRow
        label="Precinct"
        value={tree.precinct}
        theme={theme}
      />

      <InfoRow
        label="Location"
        value={tree.locationType}
        theme={theme}
      />

      <InfoRow
        label="Date planted"
        value={tree.datePlanted}
        theme={theme}
      />

      <InfoRow
        label="Age"
        value={tree.ageDescription}
        theme={theme}
      />

      <InfoRow
        label="Diameter"
        value={
          tree.dbh
            ? `${tree.dbh} cm`
            : undefined
        }
        theme={theme}
      />


      {/* COORDINATES */}
      <Text
        style={[
          styles.heading,
          {
            color:
              theme.primaryText,
          },
        ]}
      >
        Location
      </Text>


      <InfoRow
        label="Latitude"
        value={tree.latitude}
        theme={theme}
      />

      <InfoRow
        label="Longitude"
        value={tree.longitude}
        theme={theme}
      />


      {/* COMMUNITY */}
      <Text
        style={[
          styles.heading,
          {
            color:
              theme.primaryText,
          },
        ]}
      >
        Community
      </Text>


      <View
        style={[
          styles.communityCard,
          {
            backgroundColor:
              theme.communityBackground,
          },
        ]}
      >

        <Text
          style={[
            styles.communityText,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          No community bloom reports yet.
        </Text>

      </View>

    </ScrollView>
  );
}


/*
 * Reusable row used for displaying
 * information about the tree.
 */
function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value?: string;

  theme: {
    primaryText: string;
    secondaryText: string;
    border: string;
  };
}) {

  return (
    <View
      style={[
        styles.infoRow,
        {
          borderBottomColor:
            theme.border,
        },
      ]}
    >

      <Text
        style={[
          styles.infoLabel,
          {
            color:
              theme.secondaryText,
          },
        ]}
      >
        {label}
      </Text>


      <Text
        style={[
          styles.infoValue,
          {
            color:
              theme.primaryText,
          },
        ]}
      >
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
    color: '#4F7DED',
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
  },


  // -------------------------
  // BLOOM CARD
  // -------------------------

  bloomCard: {
    marginTop: 20,
    padding: 1,
  },


  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E35CB6',
  },


  bloomStatus: {
    fontSize: 23,
    fontWeight: '700',
    marginTop: 6,
    color: '#E35CA8',
  },


  bloomDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    color: '#F061B2',
  },


  // -------------------------
  // LOCATE BUTTON
  // -------------------------

  locateButton: {
    height: 50,
    backgroundColor: '#81B963',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },


  locateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
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
  },


  infoLabel: {
    width: 120,
    fontSize: 15,
  },


  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },


  // -------------------------
  // COMMUNITY
  // -------------------------

  communityCard: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
  },


  communityText: {
    fontSize: 15,
  },

});