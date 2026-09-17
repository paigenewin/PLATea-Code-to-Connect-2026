import { Text, View } from 'react-native';
import { TreeDetailsTheme } from '@/hooks/useTreeDetailsTheme';
import { styles } from '@/styles/tree-details';

export function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value?: string;
  theme: TreeDetailsTheme;
}) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
      <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.primaryText }]}>
        {value || 'Unknown'}
      </Text>
    </View>
  );
}
