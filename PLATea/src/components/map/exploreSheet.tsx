import { forwardRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
} from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { explorestyles } from '../../hooks/exploreSheet';

import {
  searchMelbourneTrees,
  searchTreesBySpecies,
  Tree,
} from '@/services/cityOfMelbourne';
import { fetchBloomingSpecies } from '@/services/bloomApi';

type Props = {
  query: string;
  bloomingOnly: boolean;
  onBloomingOnlyChange: (value: boolean) => void;
  topInset: number;
};

// pull-up panel over the map: same search
// experience the old Explore tab had, minus
// the search field itself (that lives in the
// bar fixed to the top of the screen)
const ExploreSheet = forwardRef<BottomSheet, Props>(
  function ExploreSheet(
    { query, bloomingOnly, onBloomingOnlyChange, topInset },
    ref
  ) {
    const [results, setResults] =
      useState<Tree[]>([]);

    const [loading, setLoading] =
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
      if (bloomingOnly) {
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

    }, [query, bloomingOnly]);

    async function showBlooming() {
      onBloomingOnlyChange(true);
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
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={['34%', '90%']}
        topInset={topInset}
        enableOverDrag={false}
        enablePanDownToClose={false}
        handleIndicatorStyle={explorestyles.handle}
      >
        <BottomSheetFlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={explorestyles.listContent}
          ListHeaderComponent={
            <>
              <Text style={explorestyles.title}>
                Find flowers
              </Text>

              <Animated.View style={bloomingAnimatedStyle}>
                <Pressable
                  style={({ pressed }) => [
                    explorestyles.bloomingButton,
                    pressed && explorestyles.bloomingButtonPressed,
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
                        source={require('../../../assets/images/cherryblossom.png')}
                        style={{ width: 30, height: 30, marginRight: 8 }}
                      />
                      <Text
                        style={[
                          explorestyles.bloomingButtonText,
                          pressed && explorestyles.bloomingButtonTextPressed,
                        ]}
                      >
                        Blooming now
                      </Text>
                    </>
                  )}
                </Pressable>
              </Animated.View>

              {!loading && bloomingOnly && bloomingError && (
                <Text style={explorestyles.emptyState}>
                  Couldn't reach the server. Check your connection and try again.
                </Text>
              )}

              {!loading && bloomingOnly && !bloomingError && results.length === 0 && (
                <Text style={explorestyles.emptyState}>
                  Nothing curated as blooming right now.
                </Text>
              )}

              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#db92b1"
                  style={explorestyles.loading}
                />
              )}
            </>
          }
          renderItem={({ item }) => (
            <Pressable
              style={explorestyles.result}
              onPress={() => openTree(item)}
            >
              <Text style={explorestyles.commonName}>
                {item.commonName ?? 'Unknown tree'}
              </Text>

              <Text style={explorestyles.scientificName}>
                {item.scientificName ?? 'Scientific name unavailable'}
              </Text>

              <Text style={explorestyles.precinct}>
                {item.precinct ?? 'Melbourne'}
              </Text>
            </Pressable>
          )}
        />
      </BottomSheet>
    );
  }
);

export default ExploreSheet;
