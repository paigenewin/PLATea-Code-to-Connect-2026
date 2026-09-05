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


export default function TreeDetailsScreen() {
  // Gets the tree information that was passed
  // from the Explore/Search screen.
  const tree = useLocalSearchParams<{
    id?: string;
    commonName: string;
    scientificName: string;
    genus: string;
    family: string;
    precinct: string;
    locationType: string;
    datePlanted: string;
    ageDescription: string;
    dbh: string;
    latitude: string;
    longitude: string;
  }>();


  // When the user presses "Locate on Map",
  // send this tree's coordinates to the Map screen.
  function locateTree() {
    router.navigate({
      pathname: '/',
      params: {
        latitude: tree.latitude,
        longitude: tree.longitude,
        treeName: tree.commonName,
        focusKey: Date.now().toString(),
      },
    });
  }


  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >

      {/* TREE NAME */}
      <Text style={styles.commonName}>
        {tree.commonName || 'Unknown tree'}
      </Text>

      <Text style={styles.scientificName}>
        {tree.scientificName ||
          'Scientific name unavailable'}
      </Text>


      {/* BLOOM INFORMATION */}
      <View style={styles.bloomCard}>
        <Text style={styles.label}>
          BLOOM STATUS
        </Text>

        <Text style={styles.bloomStatus}>
          Prediction coming soon
        </Text>

        <Text style={styles.bloomDescription}>
          Bloom prediction will later use
          species, season and weather data.
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
        Tree information
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
            : ''
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


      {/* COMMUNITY — FOR LATER */}
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
 * Reusable row for displaying tree information.
 *
 * Example:
 *
 * Genus        Prunus
 * Family       Rosaceae
 */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
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
    paddingTop: 24,
    paddingBottom: 60,
  },


  // Tree name
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


  // Bloom card
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


  // Locate button
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


  // Sections
  heading: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 8,
  },


  // Information rows
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


  // Community placeholder
  communityCard: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },

  communityText: {
    opacity: 0.55,
  },
});