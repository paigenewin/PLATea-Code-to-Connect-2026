import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {styles} from '../../hooks/explore';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  searchMelbourneTrees,
  searchTreesBySpecies,
  Tree,
} from '@/services/cityOfMelbourne';

import { fetchBloomingSpecies } from '@/services/bloomApi';

// store what user types and then search the current dataset for the user input
export default function ExploreScreen() {
  const [query, setQuery] = useState('');

  const [results, setResults] =
    useState<Tree[]>([]);

  const [loading, setLoading] =
    useState(false);

  // when true, results are showing
  // currently-blooming trees instead
  // of a text search
  const [showingBlooming, setShowingBlooming] =
    useState(false);

  const [bloomingError, setBloomingError] =
    useState(false);

  const bloomingScale = useSharedValue(1);

  const bloomingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bloomingScale.value }],
  }));


  useEffect(() => {
    // Text search takes over
    // from the blooming filter
    if (showingBlooming) {
      return;
    }

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

  }, [query, showingBlooming]);

  async function showBlooming() {
    setQuery('');
    setShowingBlooming(true);
    setLoading(true);
    setBloomingError(false);

    try {
      const blooming = await fetchBloomingSpecies();

      const scientificNames = blooming.flatMap(
        (species) => species.scientificNames
      );

      const trees =
        await searchTreesBySpecies(scientificNames);

      setResults(trees);
    } catch (error) {
      console.error(
        'Failed to load blooming trees:',
        error
      );

      setResults([]);
      setBloomingError(true);
    } finally {
      setLoading(false);
    }
  }

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
        onChangeText={(text) => {
          setShowingBlooming(false);
          setQuery(text);
        }}
      />

      <Animated.View style={bloomingAnimatedStyle}>
        <Pressable
          style={({ pressed }) => [
            styles.bloomingButton,
            pressed && styles.bloomingButtonPressed,
          ]}
          onPress={showBlooming}
          onPressIn={() => {
            bloomingScale.value = withSpring(0.92, {
              damping: 15,
              stiffness: 300,
            });
          }}
          onPressOut={() => {
            bloomingScale.value = withSpring(1, {
              damping: 6,
              stiffness: 200,
            });
          }}
        >
          {({ pressed }) => (
            <>
              <Image
                source = { require('../../../assets/images/cherryblossom.png') }
                style={{ width: 30, height: 30, marginRight: 8 }} />
              <Text
                style={[
                  styles.bloomingButtonText,
                  pressed && styles.bloomingButtonTextPressed,
                ]}
              >
                Blooming now
              </Text>
            </>
          )}
        </Pressable>
      </Animated.View>


      {!loading && showingBlooming && bloomingError && (
        <Text style={styles.emptyState}>
          Couldn't reach the server. Check your connection and try again.
        </Text>
      )}

      {!loading && showingBlooming && !bloomingError && results.length === 0 && (
        <Text style={styles.emptyState}>
          Nothing curated as blooming right now.
        </Text>
      )}


      {loading && (
        <ActivityIndicator
          size="small"
          color="#db92b1"
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

