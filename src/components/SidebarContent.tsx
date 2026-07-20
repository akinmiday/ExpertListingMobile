import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp, ListingType, FeedTab } from '../context/AppContext';
import { MapPin, Flame, Users, SlidersHorizontal, RefreshCw } from 'lucide-react-native';
import { TRENDING_LOCATIONS, HOT_REQUESTS, TOP_COMMUNITIES } from '../api/client';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SidebarContent(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const { filters, setLocationFilter, setTypeFilter, setTab, clearFilters } = useApp();

  const navigateToFeed = () => {
    navigation.navigate('FeedScreen');
  };

  const handleCategorySelect = (tab: FeedTab) => {
    setTab(tab);
    navigation.closeDrawer();
    navigateToFeed();
  };

  const handleLocationSelect = (loc: string) => {
    if (filters.location === loc) {
      setLocationFilter(undefined);
    } else {
      setLocationFilter(loc);
    }
    navigation.closeDrawer();
    navigateToFeed();
  };

  const handleTypeSelect = (type: ListingType) => {
    setTypeFilter(type);
    navigation.closeDrawer();
    navigateToFeed();
  };

  const handleHotRequest = (req: string) => {
    // Derive a location keyword from the request string
    const lower = req.toLowerCase();
    if (lower.includes('lekki')) setLocationFilter('Lekki');
    else if (lower.includes('yaba')) setLocationFilter('Yaba');
    else if (lower.includes('victoria')) setLocationFilter('Victoria Island');
    else if (lower.includes('ibeju')) setLocationFilter('Ibeju');
    navigation.closeDrawer();
    navigateToFeed();
  };

  const handleClear = () => {
    clearFilters();
    navigation.closeDrawer();
    navigateToFeed();
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top > 0 ? insets.top : 16,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
        }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <SlidersHorizontal size={20} color={Colors.primary} />
        <Text style={styles.headerTitle}>Filters & Explore</Text>
      </View>

      {/* Feed Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feed Category</Text>
        <View style={styles.row}>
          {(['Property', 'General', 'Request'] as FeedTab[]).map((tab) => {
            const isActive = filters.tab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => handleCategorySelect(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Listing Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Listing Type</Text>
        <View style={styles.row}>
          {(['All', 'For Rent', 'For Sale'] as ListingType[]).map((type) => {
            const isActive = filters.type === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => handleTypeSelect(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
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
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Trending Locations</Text>
        </View>
        <View style={styles.list}>
          {TRENDING_LOCATIONS.map((loc) => {
            const isActive = filters.location === loc;
            return (
              <TouchableOpacity
                key={loc}
                style={[styles.item, isActive && styles.itemActive]}
                onPress={() => handleLocationSelect(loc)}
                activeOpacity={0.7}
              >
                <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
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
          <Flame size={14} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Hot Requests</Text>
        </View>
        <View style={styles.list}>
          {HOT_REQUESTS.map((req) => (
            <TouchableOpacity
              key={req}
              style={styles.item}
              onPress={() => handleHotRequest(req)}
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
          <Users size={14} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Top Communities</Text>
        </View>
        <View style={styles.list}>
          {TOP_COMMUNITIES.map((comm) => (
            <TouchableOpacity
              key={comm}
              style={styles.item}
              onPress={() => navigation.closeDrawer()}
              activeOpacity={0.7}
            >
              <Text style={styles.itemText}>{comm}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Clear All */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClear}
        activeOpacity={0.8}
      >
        <RefreshCw size={15} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.clearButtonText}>Clear All Filters</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.card,
  },
  container: {
    padding: 20,
    paddingTop: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 14,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: 'bold',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 6,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  itemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  itemText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  itemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
