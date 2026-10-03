import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './src/store/AppDataContext';
import RootNavigator from './src/navigation/RootNavigator';
import { fontAssets } from './src/theme';

export default function App() {
  useFonts(fontAssets);

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
