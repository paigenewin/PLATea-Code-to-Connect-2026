import { Pressable, ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { treeToRouteParams } from '@/utils/treeParams';
import { useBloomPrediction } from '@/hooks/useBloomPrediction';
import { useCommunityReport } from '@/hooks/useCommunityReport';
import { useTreeDetailsTheme } from '@/hooks/useTreeDetailsTheme';
import { InfoRow } from '@/components/tree-details/InfoRow';
import { BloomStatusCard } from '@/components/tree-details/BloomStatusCard';
import { CommunityCard } from '@/components/tree-details/CommunityCard';
import { styles } from '@/styles/tree-details';

export default function TreeDetailsScreen() {
  const theme = useTreeDetailsTheme();

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

  const { bloomStatus, bloomLoading, bloomError } =
    useBloomPrediction(tree.scientificName);
  const {
    reports,
    showContribution,
    setShowContribution,
    contributionText,
    setContributionText,
    submitContribution,
  } = useCommunityReport(tree.id);

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
        focusKey: Date.now().toString(),
      },
    });
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* BACK TO SEARCH */}
      <Pressable style={styles.backButton} onPress={backToSearch}>
        <Text style={styles.backButtonText}>← Back to Search Results</Text>
      </Pressable>

      {/* TREE NAME */}
      <Text style={[styles.commonName, { color: theme.primaryText }]}>
        {tree.commonName || 'Unknown tree'}
      </Text>
      <Text style={[styles.scientificName, { color: theme.secondaryText }]}>
        {tree.scientificName || 'Scientific name unavailable'}
      </Text>

      {/* BLOOM STATUS */}
      <BloomStatusCard
        bloomStatus={bloomStatus}
        bloomLoading={bloomLoading}
        bloomError={bloomError}
      />

      {/* LOCATE BUTTON */}
      <Pressable style={styles.locateButton} onPress={locateTree}>
        <Text style={styles.locateButtonText}>Locate on Map</Text>
      </Pressable>

      {/* TREE INFORMATION */}
      <Text style={[styles.heading, { color: theme.primaryText }]}>
        Tree Information
      </Text>
      <InfoRow label="Genus" value={tree.genus} theme={theme} />
      <InfoRow label="Family" value={tree.family} theme={theme} />
      <InfoRow label="Precinct" value={tree.precinct} theme={theme} />
      <InfoRow label="Location" value={tree.locationType} theme={theme} />
      <InfoRow label="Date planted" value={tree.datePlanted} theme={theme} />
      <InfoRow label="Age" value={tree.ageDescription} theme={theme} />
      <InfoRow
        label="Diameter"
        value={tree.dbh ? `${tree.dbh} cm` : undefined}
        theme={theme}
      />

      {/* COORDINATES */}
      <Text style={[styles.heading, { color: theme.primaryText }]}>
        Location
      </Text>
      <InfoRow label="Latitude" value={tree.latitude} theme={theme} />
      <InfoRow label="Longitude" value={tree.longitude} theme={theme} />

      {/* COMMUNITY */}
      <Text style={[styles.heading, { color: theme.primaryText }]}>
        Community
      </Text>
      <CommunityCard
        theme={theme}
        reports={reports}
        showContribution={showContribution}
        setShowContribution={setShowContribution}
        contributionText={contributionText}
        setContributionText={setContributionText}
        submitContribution={submitContribution}
      />
    </ScrollView>
  );
}
