import { useColorScheme } from 'react-native';

export function useTreeDetailsTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    background: isDark ? '#171512' : '#FFFFFF',
    primaryText: isDark ? '#ffffff' : '#2B2925',
    secondaryText: isDark ? '#E6E6E6' : '#414040',
    border: isDark ? '#FFFFFF20' : '#702C2C18',
    communityBackground: isDark ? '#211F1B' : '#FFFFFF',
  };
}

export type TreeDetailsTheme = ReturnType<typeof useTreeDetailsTheme>;
