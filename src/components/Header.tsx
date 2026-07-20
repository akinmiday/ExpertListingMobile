import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  routeName?: string;
}

export default function Header({ routeName }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const showMenu = routeName === 'Feed';

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
          {showMenu ? (
            <TouchableOpacity 
              style={styles.menuButton} 
              activeOpacity={0.7}
              onPress={() => navigation.openDrawer()}
            >
              <Menu size={24} color={Colors.text} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}
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
  menuButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
