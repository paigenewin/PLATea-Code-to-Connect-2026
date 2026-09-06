import { forwardRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
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
import { Ionicons } from '@expo/vector-icons';
import { explorestyles } from '../../hooks/exploreSheet';

import {
  searchMelbourneTrees,
  searchTreesBySpecies,
  Tree,
} from '@/services/cityOfMelbourne';
import { fetchBloomingSpecies, NearbyTree } from '@/services/bloomApi';
import { formatDistance } from '@/utils/distance';

type ResultItem = Tree | NearbyTree;

function isNearbyTree(item: ResultItem): item is NearbyTree {
  return 'distanceMetres' in item;
}

type Props = {
  query: string;
  bloomingOnly: boolean;
  onBloomingOnlyChange: (value: boolean) => void;
  topInset: number;
  imageSearchResults: NearbyTree[] | null;
  onClearImageSearch: () => void;
  onTrackResult: (item: ResultItem) => void;
};

// pull-up panel over the map: same search
// experience the old Explore tab had, minus
// the search field itself (that lives in the
// bar fixed to the top of the screen)
const ExploreSheet = forwardRef<BottomSheet, Props>(
  function ExploreSheet(
    {
      query,
      bloomingOnly,
      onBloomingOnlyChange,
      topInset,
      imageSearchResults,
      onClearImageSearch,
      onTrackResult,
    },
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

    const showingImageResults = Boolean(
      imageSearchResults && imageSearchResults.length > 0
    );

    useEffect(() => {
      // Photo-search results take over from
      // both text search and the blooming filter
      if (showingImageResults) {
        return;
      }

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

    }, [query, bloomingOnly, showingImageResults]);

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

    function openResult(item: ResultItem) {
      const fromNearbySearch = isNearbyTree(item);

      router.push({
        pathname: '/tree-details',
        params: {
          commonName: item.commonName ?? '',
          scientificName: item.scientificName ?? '',
          genus: fromNearbySearch ? '' : item.genus ?? '',
          family: fromNearbySearch ? '' : item.family ?? '',
          precinct: item.precinct ?? '',
          locationType: fromNearbySearch ? '' : item.locationType ?? '',
          datePlanted: fromNearbySearch ? '' : item.datePlanted ?? '',
          ageDescription: fromNearbySearch ? '' : item.ageDescription ?? '',
          dbh: fromNearbySearch ? '' : item.dbh?.toString() ?? '',
          latitude: item.latitude.toString(),
          longitude: item.longitude.toString(),
        },
      });
    }

    const displayData: ResultItem[] = showingImageResults
      ? imageSearchResults!
      : results;

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={['34%', '90%']}
        topInset={topInset}
        enableOverDrag={false}
        enablePanDownToClose={false}
        backgroundStyle={explorestyles.sheetBackground}
        handleIndicatorStyle={explorestyles.handle}
      >
        <BottomSheetFlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={explorestyles.listContent}
          ListHeaderComponent={
            showingImageResults ? (
              <>
                <Text style={explorestyles.title}>
                  Trees near you
                </Text>

                <Pressable onPress={onClearImageSearch}>
                  <Text style={explorestyles.clearImageSearch}>
                    Clear photo results
                  </Text>
                </Pressable>
              </>
            ) : (
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
            )
          }
          renderItem={({ item, index }) => (
            <Pressable
              style={[explorestyles.result, explorestyles.resultRow]}
              onPress={() => openResult(item)}
            >
              <View style={explorestyles.resultText}>
                <View style={explorestyles.resultNameRow}>
                  <Text style={explorestyles.commonName}>
                    {item.commonName ?? 'Unknown tree'}
                  </Text>

                  {showingImageResults && index === 0 && (
                    <View style={explorestyles.nearestBadge}>
                      <Text style={explorestyles.nearestBadgeText}>
                        Nearest
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={explorestyles.scientificName}>
                  {item.scientificName ?? 'Scientific name unavailable'}
                </Text>

                <Text style={explorestyles.precinct}>
                  {item.precinct ?? 'Melbourne'}
                  {isNearbyTree(item)
                    ? ` · ${formatDistance(item.distanceMetres)}`
                    : ''}
                </Text>
              </View>

              <Pressable
                style={explorestyles.trackButton}
                hitSlop={8}
                onPress={() => onTrackResult(item)}
              >
                <Ionicons name="navigate" size={20} color="#e43c8a" />
              </Pressable>
            </Pressable>
          )}
        />
      </BottomSheet>
    );
  }
);

export default ExploreSheet;
