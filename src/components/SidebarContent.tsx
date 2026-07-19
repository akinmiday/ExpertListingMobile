import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp, ListingType, FeedTab } from '../context/AppContext';
import { MapPin, Flame, Users, SlidersHorizontal, RefreshCw } from 'lucide-react-native';
import { TRENDING_LOCATIONS, HOT_REQUESTS, TOP_COMMUNITIES } from '../api/client';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';

export default function SidebarContent(props: DrawerContentComponentProps) {
  const { filters, setLocationFilter, setTypeFilter, setTab, clearFilters } = useApp();

  const handleLocationSelect = (loc: string) => {
    if (filters.location === loc) {
      setLocationFilter(undefined); // toggle off
    } else {
      setLocationFilter(loc);
    }
    props.navigation.closeDrawer();
  };

  const handleTypeSelect = (type: ListingType) => {
    setTypeFilter(type);
  };

  const handleClear = () => {
    clearFilters();
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <SlidersHorizontal size={20} color={Colors.primary} />
        <Text style={styles.headerTitle}>Filters & Explore</Text>
      </View>

      {/* Feed Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feed Category</Text>
        <View style={styles.typeSelectorRow}>
          {(['Property', 'General', 'Request'] as FeedTab[]).map((tab) => {
            const isActive = filters.tab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.typeButton,
                  isActive && styles.typeButtonActive
                ]}
                onPress={() => setTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeText,
                  isActive && styles.typeTextActive
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Listing Type Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Listing Type</Text>
        <View style={styles.typeSelectorRow}>
          {(['All', 'For Rent', 'For Sale'] as ListingType[]).map((type) => {
            const isActive = filters.type === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  isActive && styles.typeButtonActive
                ]}
                onPress={() => handleTypeSelect(type)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeText,
                  isActive && styles.typeTextActive
                ]}>
                  {type === 'All' ? 'Any' : type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Trending Locations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Trending Locations</Text>
        </View>
        <View style={styles.itemsList}>
          {TRENDING_LOCATIONS.map((loc) => {
            const isActive = filters.location === loc;
            return (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.itemRow,
                  isActive && styles.itemRowActive
                ]}
                onPress={() => handleLocationSelect(loc)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.itemText,
                  isActive && styles.itemTextActive
                ]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hot Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Flame size={16} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Hot Requests</Text>
        </View>
        <View style={styles.itemsList}>
          {HOT_REQUESTS.map((req) => (
            <TouchableOpacity
              key={req}
              style={styles.itemRow}
              onPress={() => {
                setLocationFilter('Lekki'); // mock search change
                props.navigation.closeDrawer();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.itemText}>{req}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Top Communities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={16} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Top Communities</Text>
        </View>
        <View style={styles.itemsList}>
          {TOP_COMMUNITIES.map((comm) => (
            <TouchableOpacity
              key={comm}
              style={styles.itemRow}
              onPress={() => {
                props.navigation.closeDrawer();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.itemText}>{comm}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Clear Filters Button */}
      <TouchableOpacity 
        style={styles.clearButton} 
        onPress={handleClear}
        activeOpacity={0.8}
      >
        <RefreshCw size={16} color="#FFF" style={styles.clearIcon} />
        <Text style={styles.clearButtonText}>Clear All Filters</Text>
      </TouchableOpacity>
    </View>
  </DrawerContentScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  itemRowActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  itemText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  itemTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    marginTop: 10,
  },
  clearIcon: {
    marginRight: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
