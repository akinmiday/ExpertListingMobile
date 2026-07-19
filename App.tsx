import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { Colors } from './src/theme/colors';

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
      <AppProvider>
        <NavigationContainer theme={CustomTheme}>
          <DrawerNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
