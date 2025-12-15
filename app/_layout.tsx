/**
 * Layout racine de l'application Kiosko
 * Configure la navigation et le thème
 */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { CartSheet } from '@/components/CartSheet';
import { Colors } from '@/constants/theme';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="loyalty/index" />
        <Stack.Screen name="loyalty/scan" />
        <Stack.Screen name="menu/index" />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen name="payment/index" />
        <Stack.Screen name="confirmation/index" />
      </Stack>
      <CartSheet />
    </View>
  );
}
