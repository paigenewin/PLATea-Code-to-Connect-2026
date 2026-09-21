import { Platform } from 'react-native';

/*
 * On web, the browser and the dev server run on the same
 * machine, so localhost always reaches it. EXPO_PUBLIC_API_URL
 * is for native (phone/simulator), where localhost means the
 * device itself, not the dev machine - it has to be a LAN IP
 * that changes whenever the dev machine switches networks.
 */
export const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000');
