import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import TabNavigator from './src/navigation/TabNavigator';
import { Colors } from './src/theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.navBg,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  }
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer theme={CustomTheme}>
            <TabNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
