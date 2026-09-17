import { Pressable, Text, TextInput, View } from 'react-native';
import { CommunityReport } from '@/services/communityApi';
import { TreeDetailsTheme } from '@/hooks/useTreeDetailsTheme';
import { styles } from '@/styles/tree-details';

export function CommunityCard({
  theme,
  reports,
  showContribution,
  setShowContribution,
  contributionText,
  setContributionText,
  submitContribution,
}: {
  theme: TreeDetailsTheme;
  reports: CommunityReport[];
  showContribution: boolean;
  setShowContribution: (value: boolean) => void;
  contributionText: string;
  setContributionText: (value: string) => void;
  submitContribution: () => void;
}) {
  return (
    <View
      style={[
        styles.communityCard,
        { backgroundColor: theme.communityBackground },
      ]}
    >
      {reports.length === 0 ? (
        <Text style={[styles.communityText, { color: theme.secondaryText }]}>
          No community bloom reports yet.
        </Text>
      ) : (
        reports.map((report) => (
          <View
            key={report.id}
            style={[styles.reportItem, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.reportMessage, { color: theme.primaryText }]}>
              {report.message}
            </Text>

            <Text style={[styles.reportDate, { color: theme.secondaryText }]}>
              {new Date(report.createdAt).toLocaleString()}
            </Text>
          </View>
        ))
      )}
      {!showContribution ? (
        <Pressable
          style={styles.contributeButton}
          onPress={() => setShowContribution(true)}
        >
          <Text style={styles.contributeButtonText}>Contribute</Text>
        </Pressable>
      ) : (
        <View style={styles.contributionArea}>
          <TextInput
            style={[
              styles.contributionInput,
              { color: theme.primaryText, borderColor: theme.border },
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
                style={[styles.cancelButtonText, { color: theme.secondaryText }]}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitButton,
                !contributionText.trim() && styles.submitButtonDisabled,
              ]}
              disabled={!contributionText.trim()}
              onPress={submitContribution}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
