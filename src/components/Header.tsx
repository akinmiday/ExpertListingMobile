import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerContent}>
        {/* Brand Logo */}
        <View style={styles.logoRow}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage} 
            contentFit="contain"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.signInButton} activeOpacity={0.7}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuButton} 
            activeOpacity={0.7}
            onPress={() => navigation.openDrawer()}
          >
            <Menu size={24} color={Colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 150,
    height: 35,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  signInButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signInText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  menuButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
