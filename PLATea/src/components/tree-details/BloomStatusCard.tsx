import { Text, View } from 'react-native';
import { BloomStatus } from '@/services/bloomApi';
import { styles } from '@/styles/tree-details';

const BLOOM_STATUS_TEXT: Record<BloomStatus, string> = {
  blooming: 'Blooming now',
  blooming_soon: 'Blooming soon',
  not_in_season: 'Not in season',
  unknown: 'Status unknown',
};

export function BloomStatusCard({
  bloomStatus,
  bloomLoading,
  bloomError,
}: {
  bloomStatus: BloomStatus | null;
  bloomLoading: boolean;
  bloomError: boolean;
}) {
  return (
    <View style={styles.bloomCard}>
      <Text style={styles.label}>BLOOM STATUS</Text>
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
          : BLOOM_STATUS_TEXT[bloomStatus ?? 'unknown']}
      </Text>
    </View>
  );
}
