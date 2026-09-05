import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';


export default function TreeDetailsScreen() {
  const tree = useLocalSearchParams<{
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


  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.commonName}>
        {tree.commonName || 'Unknown tree'}
      </Text>

      <Text style={styles.scientificName}>
        {tree.scientificName ||
          'Scientific name unavailable'}
      </Text>


      <View style={styles.bloomCard}>
        <Text style={styles.label}>
          BLOOM STATUS
        </Text>

        <Text style={styles.bloomStatus}>
          Prediction coming soon
        </Text>
      </View>


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
    </ScrollView>
  );
}


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
    padding: 20,
    paddingBottom: 60,
  },

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

  heading: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 8,
  },

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
});