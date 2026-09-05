import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  searchMelbourneTrees,
  Tree,
} from '@/services/cityOfMelbourne';

// store what user types and then search the current dataset for the user input
export default function ExploreScreen() {
  const [query, setQuery] = useState('');

  const [results, setResults] =
    useState<Tree[]>([]);

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {
    // If less than 2 letters,
    // don't search yet
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Wait a little after user types
    const timer = setTimeout(async () => {
      setLoading(true);

      const trees =
        await searchMelbourneTrees(query);

      setResults(trees);

      setLoading(false);
    }, 350);


    // Cancel old search if user
    // continues typing
    return () => clearTimeout(timer);

  }, [query]);

  function openTree(tree: Tree) {
    router.push({
      pathname: '/tree-details',
      params: {
        commonName: tree.commonName ?? '',
        scientificName: tree.scientificName ?? '',
        genus: tree.genus ?? '',
        family: tree.family ?? '',
        precinct: tree.precinct ?? '',
        locationType: tree.locationType ?? '',
        datePlanted: tree.datePlanted ?? '',
        ageDescription: tree.ageDescription ?? '',
        dbh: tree.dbh?.toString() ?? '',
        latitude: tree.latitude.toString(),
        longitude: tree.longitude.toString(),
      },
    });
  }


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Find flowers
      </Text>


      <TextInput
        style={styles.searchInput}
        placeholder="Search flower name..."
        value={query}
        onChangeText={setQuery}
      />


      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      )}


      <FlatList
        data={results}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={({ item }) => (
          <Pressable
            style={styles.result}
            // rendering the tapping search result function
            onPress={() => {
            console.log('Pressed tree:', item.commonName);
            openTree(item);
            }}
          >

            <Text style={styles.commonName}>
              {item.commonName ??
                'Unknown tree'}
            </Text>

            <Text style={styles.scientificName}>
              {item.scientificName ??
                'Scientific name unavailable'}
            </Text>

            <Text style={styles.precinct}>
              {item.precinct ??
                'Melbourne'}
            </Text>

          </Pressable>
        )}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },

  searchInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },

  loading: {
    marginTop: 20,
  },

  result: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  commonName: {
    fontSize: 18,
    fontWeight: '600',
  },

  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 3,
  },

  precinct: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.6,
  },
});