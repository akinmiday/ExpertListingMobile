import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp, FeedTab } from '../context/AppContext';

export default function FeedTabs() {
  const { filters, setTab } = useApp();
  const tabs: Exclude<FeedTab, 'All'>[] = ['Property', 'General', 'Request'];

  const activeTab = filters.tab;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              isActive && styles.activeTabButton
            ]}
            onPress={() => setTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              isActive && styles.activeTabText
            ]}>
              {tab}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 48,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    // no capsule styling
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: Colors.text,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
