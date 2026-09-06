import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';

import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  /*
   * Warm the image cache for the flower artwork
   * shown in LoadingScreen, so it doesn't visibly
   * pop in after the surrounding text later on.
   */
  useEffect(() => {
    Asset.loadAsync(
      require('../../assets/images/cherryblossom.png')
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        value={
          colorScheme === 'dark'
            ? DarkTheme
            : DefaultTheme
        }
      >
        <AnimatedSplashOverlay />

        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: 'Back',
            }}
          />

          <Stack.Screen
            name="tree-details"
            options={{
              title: 'Tree Details',
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}