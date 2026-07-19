import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

function createPlaceholderScreen(name: string) {
  return () => (
    <View style={styles.container}>
      <Text style={styles.title}>{name} Screen</Text>
      <Text style={styles.subtitle}>This is a placeholder for the {name.toLowerCase()} page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});

export const ListScreen = createPlaceholderScreen('List');
