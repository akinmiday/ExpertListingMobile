import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TextInput, KeyboardAvoidingView,
  Platform, ScrollView, Alert, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin, Check, Image as ImageIcon, Plus, Home, Building2,
  Bed, Bath, Car, Ruler, ChevronDown, Sparkles, Camera, X,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PRESET_IMAGES = [
  { id: '1', name: 'Penthouse', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600', thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200' },
  { id: '2', name: 'Modern Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200' },
  { id: '3', name: 'Luxury Pool', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200' },
  { id: '4', name: 'Interior', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200' },
];

const LOCATIONS = [
  'Lekki Phase 1, Lagos',
  'Ikoyi, Lagos',
  'Victoria Island, Lagos',
  'Ikeja, Lagos',
  'Yaba, Lagos',
];

export default function CreatePostScreen() {
  const { handleAddPost } = useApp();
  const navigation = useNavigation<any>();

  const [body, setBody] = useState('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [listingType, setListingType] = useState<'For Rent' | 'For Sale'>('For Rent');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(0);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [parking, setParking] = useState('1');
  const [sqft, setSqft] = useState('');

  // Animation for submit button
  const submitScale = useRef(new Animated.Value(1)).current;

  const animateSubmit = () => {
    Animated.sequence([
      Animated.timing(submitScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(submitScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    if (!body.trim()) {
      Alert.alert('Missing Details', 'Please add a description for your property listing.');
      return;
    }

    animateSubmit();

    const imageUrl = selectedImageIdx !== null ? PRESET_IMAGES[selectedImageIdx].url : undefined;

    // Build enriched body with specs
    let enrichedBody = body;
    const specs: string[] = [];
    if (bedrooms) specs.push(`${bedrooms} Bedroom${parseInt(bedrooms) > 1 ? 's' : ''}`);
    if (bathrooms) specs.push(`${bathrooms} Bathroom${parseInt(bathrooms) > 1 ? 's' : ''}`);
    if (parking) specs.push(`${parking} Parking`);
    if (sqft) specs.push(`${sqft} sqft`);
    if (specs.length > 0) {
      enrichedBody = `${body}\n\n📐 ${specs.join(' • ')}`;
    }

    handleAddPost(enrichedBody, location, 'Property', listingType, imageUrl);

    // Reset
    setBody('');
    setLocation('Lekki Phase 1, Lagos');
    setListingType('For Rent');
    setSelectedImageIdx(0);
    setBedrooms('3');
    setBathrooms('2');
    setParking('1');
    setSqft('');

    navigation.navigate('Feed');
  };

  const charCount = body.length;
  const MAX_CHARS = 500;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <View style={styles.heroIconRow}>
            <View style={styles.heroIconBg}>
              <Home size={22} color={Colors.primary} />
            </View>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color="#F59E0B" />
              <Text style={styles.heroBadgeText}>Premium</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Create Property Listing</Text>
          <Text style={styles.heroSubtitle}>
            Showcase your property to thousands of potential buyers and tenants in Lagos.
          </Text>
        </View>

        {/* Listing Type Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Listing Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                listingType === 'For Rent' && styles.toggleOptionActiveRent,
              ]}
              onPress={() => setListingType('For Rent')}
              activeOpacity={0.7}
            >
              <Building2
                size={16}
                color={listingType === 'For Rent' ? '#FFFFFF' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.toggleText,
                  listingType === 'For Rent' && styles.toggleTextActive,
                ]}
              >
                For Rent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                listingType === 'For Sale' && styles.toggleOptionActiveSale,
              ]}
              onPress={() => setListingType('For Sale')}
              activeOpacity={0.7}
            >
              <Home
                size={16}
                color={listingType === 'For Sale' ? '#FFFFFF' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.toggleText,
                  listingType === 'For Sale' && styles.toggleTextActive,
                ]}
              >
                For Sale
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Specs Row */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Property Specs</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <View style={styles.specIconBg}>
                <Bed size={14} color={Colors.primary} />
              </View>
              <Text style={styles.specLabel}>Beds</Text>
              <TextInput
                style={styles.specInput}
                value={bedrooms}
                onChangeText={setBedrooms}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBg}>
                <Bath size={14} color={Colors.secondary} />
              </View>
              <Text style={styles.specLabel}>Baths</Text>
              <TextInput
                style={styles.specInput}
                value={bathrooms}
                onChangeText={setBathrooms}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBg}>
                <Car size={14} color="#F59E0B" />
              </View>
              <Text style={styles.specLabel}>Parking</Text>
              <TextInput
                style={styles.specInput}
                value={parking}
                onChangeText={setParking}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBg}>
                <Ruler size={14} color="#A855F7" />
              </View>
              <Text style={styles.specLabel}>Sqft</Text>
              <TextInput
                style={styles.specInput}
                value={sqft}
                onChangeText={setSqft}
                keyboardType="number-pad"
                placeholder="—"
                maxLength={6}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Location Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => setShowLocationPicker(!showLocationPicker)}
            activeOpacity={0.7}
          >
            <View style={styles.locationSelectorLeft}>
              <View style={styles.locationIconBg}>
                <MapPin size={14} color={Colors.primary} />
              </View>
              <Text style={styles.locationSelectedText}>{location}</Text>
            </View>
            <ChevronDown
              size={18}
              color={Colors.textMuted}
              style={{ transform: [{ rotate: showLocationPicker ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {showLocationPicker && (
            <View style={styles.locationDropdown}>
              {LOCATIONS.map((loc) => {
                const isActive = location === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.locationOption, isActive && styles.locationOptionActive]}
                    onPress={() => {
                      setLocation(loc);
                      setShowLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <MapPin size={13} color={isActive ? Colors.primary : Colors.textMuted} />
                    <Text style={[styles.locationOptionText, isActive && styles.locationOptionTextActive]}>
                      {loc}
                    </Text>
                    {isActive && <Check size={14} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={[styles.charCounter, charCount > MAX_CHARS && styles.charCounterOver]}>
              {charCount}/{MAX_CHARS}
            </Text>
          </View>
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe the property features, amenities, and any special details that make it stand out..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={body}
              onChangeText={(t) => t.length <= MAX_CHARS && setBody(t)}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photo Selection */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.mediaLabelRow}>
              <Camera size={14} color={Colors.primary} />
              <Text style={styles.sectionLabel}>Property Photos</Text>
            </View>
            {selectedImageIdx !== null && (
              <TouchableOpacity onPress={() => setSelectedImageIdx(null)}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoScrollContent}
          >
            {PRESET_IMAGES.map((img, idx) => {
              const isSelected = selectedImageIdx === idx;
              return (
                <TouchableOpacity
                  key={img.id}
                  style={[styles.photoCard, isSelected && styles.photoCardSelected]}
                  onPress={() => setSelectedImageIdx(idx)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: img.thumb }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                  {isSelected && (
                    <View style={styles.photoOverlay}>
                      <View style={styles.photoCheckCircle}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                  <View style={styles.photoLabelRow}>
                    <Text style={[styles.photoLabel, isSelected && styles.photoLabelActive]}>
                      {img.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Preview Card */}
        {(body.trim() || selectedImageIdx !== null) && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewCard}>
              {selectedImageIdx !== null && (
                <Image
                  source={{ uri: PRESET_IMAGES[selectedImageIdx].thumb }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
              )}
              <View style={styles.previewContent}>
                <View style={styles.previewTagRow}>
                  <View style={[
                    styles.previewTag,
                    listingType === 'For Rent' ? styles.previewTagRent : styles.previewTagSale,
                  ]}>
                    <Text style={[
                      styles.previewTagText,
                      { color: listingType === 'For Rent' ? Colors.tagRentText : Colors.tagSaleText },
                    ]}>
                      {listingType}
                    </Text>
                  </View>
                </View>
                {body.trim() ? (
                  <Text style={styles.previewBody} numberOfLines={2}>
                    {body}
                  </Text>
                ) : null}
                <View style={styles.previewLocationRow}>
                  <MapPin size={11} color={Colors.textMuted} />
                  <Text style={styles.previewLocationText}>{location}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Spacer for button */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Submit Button */}
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: submitScale }], flex: 1 }}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <View style={styles.submitInner}>
              <Plus size={18} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.submitButtonText}>Publish Listing</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 20,
  },

  // Hero Header
  heroHeader: {
    gap: 10,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },

  // Section
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // Toggle (Listing Type)
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 11,
  },
  toggleOptionActiveRent: {
    backgroundColor: Colors.primary,
  },
  toggleOptionActiveSale: {
    backgroundColor: Colors.secondary,
  },
  toggleText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // Property Specs
  specsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  specItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  specIconBg: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specInput: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // Location
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  locationSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIconBg: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationSelectedText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  locationDropdown: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationOptionActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  locationOptionText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 14,
  },
  locationOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Description
  descriptionContainer: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  textInput: {
    padding: 16,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 130,
  },
  charCounter: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  charCounterOver: {
    color: Colors.likeActive,
  },
  clearText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  // Photo Selection
  photoScrollContent: {
    gap: 10,
    paddingRight: 4,
  },
  photoCard: {
    width: (SCREEN_WIDTH - 60) / 2.5,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  photoCardSelected: {
    borderColor: Colors.primary,
  },
  photoImage: {
    width: '100%',
    height: 90,
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: 90,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCheckCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoLabelRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  photoLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  photoLabelActive: {
    color: Colors.primary,
  },

  // Preview
  previewSection: {
    gap: 10,
  },
  previewTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 120,
  },
  previewContent: {
    padding: 14,
    gap: 8,
  },
  previewTagRow: {
    flexDirection: 'row',
  },
  previewTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewTagRent: {
    backgroundColor: Colors.tagRentBg,
  },
  previewTagSale: {
    backgroundColor: Colors.tagSaleBg,
  },
  previewTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  previewBody: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 19,
  },
  previewLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewLocationText: {
    color: Colors.textMuted,
    fontSize: 12,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  submitInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
