import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  CommunityReport,
  createReport,
  fetchTreeReports,
} from '@/services/communityApi';
import {
  Pressable, Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
      ? '#ffffff'
      : '#2B2925',
    secondaryText: isDark
      ? '#E6E6E6' : '#414040',
    border: isDark
      ? '#FFFFFF20'
      : '#702C2C18',
    communityBackground: isDark
      ? '#211F1B'
      : '#FFFFFF',
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
  const [showContribution, setShowContribution] =
    useState(false);
  const [contributionText, setContributionText] =
    useState('');
  const [reports, setReports] =
    useState<CommunityReport[]>([]);

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
   * Load existing community reports
   * for this tree.
   */
  useEffect(() => {
    if (!tree.id) {
      return;
    }

    fetchTreeReports(tree.id)
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        console.error(
          'Failed to load community reports:',
          error
        );
      });
  }, [tree.id]);

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
  async function submitContribution() {
    const cleanText = contributionText.trim();

    console.log('Submit pressed');
    console.log('Tree ID:', tree.id);
    console.log('Message:', cleanText);

    if (!cleanText) {
        Alert.alert(
        'Empty contribution',
        'Please write something first.'
        );
        return;
    }

    if (!tree.id) {
        Alert.alert(
        'Missing tree ID',
        'This tree does not have an ID.'
        );
        return;
    }

    try {
        console.log('Sending report to backend...');

        const newReport = await createReport(
        tree.id,
        cleanText
        );

        console.log('Report created:', newReport);

        setReports((currentReports) => [
        newReport,
        ...currentReports,
        ]);

        setContributionText('');
        setShowContribution(false);

        Alert.alert(
        'Submitted',
        'Your contribution was added.'
        );

    } catch (error) {
        console.error(
        'Failed to submit contribution:',
        error
        );

        Alert.alert(
        'Submit failed',
        'Could not connect to the server.'
        );
    }
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
        {reports.length === 0 ? (
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
        ) : (
          reports.map((report) => (
            <View
              key={report.id}
              style={[
                styles.reportItem,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.reportMessage,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                {report.message}
              </Text>

              <Text
                style={[
                  styles.reportDate,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                {new Date(
                  report.createdAt
                ).toLocaleString()}
              </Text>
            </View>
          ))
        )}
        {!showContribution ? (
          <Pressable
            style={styles.contributeButton}
            onPress={() => setShowContribution(true)}
          >
            <Text style={styles.contributeButtonText}>
              Contribute
            </Text>
          </Pressable>
        ) : (
          <View style={styles.contributionArea}>
            <TextInput
              style={[
                styles.contributionInput,
                {
                  color: theme.primaryText,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Write what you noticed about this tree..."
              placeholderTextColor={theme.secondaryText}
              value={contributionText}
              onChangeText={setContributionText}
              multiline
              maxLength={500}
            />
            <View style={styles.contributionButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setContributionText('');
                  setShowContribution(false);
                }}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: theme.secondaryText },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.submitButton,
                  !contributionText.trim() &&
                    styles.submitButtonDisabled,
                ]}
                disabled={!contributionText.trim()}
                onPress={submitContribution}
              >
                <Text style={styles.submitButtonText}>
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        )}
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
    paddingHorizontal: 1,

  },
  communityText: {
    fontSize: 15,
  },
  reportItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  reportMessage: {
    fontSize: 15,
  },
  reportDate: {
    fontSize: 12,
    marginTop: 5,
  },
  contributeButton: {
    height: 44,
    backgroundColor: '#ea8dbf',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  contributeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  contributionArea: {
    marginTop: 12,
  },
  contributionInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  contributionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: 42,
    backgroundColor: '#64b76c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
