import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Check, Image as ImageIcon, Plus } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const PRESET_IMAGES = [
  { id: '1', name: 'Penthouse', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600' },
  { id: '2', name: 'Modern Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
  { id: '3', name: 'Luxury Pool', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' }
];

export default function CreatePostScreen() {
  const { handleAddPost } = useApp();
  const navigation = useNavigation<any>();

  const [body, setBody] = useState('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [listingType, setListingType] = useState<'For Rent' | 'For Sale'>('For Rent');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(0); // Default to first preset

  const handleSubmit = () => {
    if (!body.trim()) {
      Alert.alert('Error', 'Please enter a description for the property.');
      return;
    }

    const imageUrl = selectedImageIdx !== null ? PRESET_IMAGES[selectedImageIdx].url : undefined;

    handleAddPost(
      body,
      location,
      'Property', // Hardcoded to 'Property' category as requested!
      listingType,
      imageUrl
    );

    // Reset fields
    setBody('');
    setLocation('Lekki Phase 1, Lagos');
    setListingType('For Rent');
    setSelectedImageIdx(0);

    // Navigate back to Feed screen
    navigation.navigate('Feed');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>List a Property</Text>
          <Text style={styles.subtitle}>Enter detailed specifications to publish a new property listing to the feed.</Text>
        </View>

        {/* Listing Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, listingType === 'For Rent' && styles.tabButtonActive]}
              onPress={() => setListingType('For Rent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, listingType === 'For Rent' && styles.tabTextActive]}>
                For Rent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, listingType === 'For Sale' && styles.tabButtonActive]}
              onPress={() => setListingType('For Sale')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, listingType === 'For Sale' && styles.tabTextActive]}>
                For Sale
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationInputRow}>
            <MapPin size={16} color={Colors.primary} />
            <TextInput
              style={styles.locationInput}
              placeholder="Enter location (e.g. Lekki Phase 1, Lagos)"
              placeholderTextColor={Colors.textMuted}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Property Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the property (e.g. Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars...)"
            placeholderTextColor={Colors.textMuted}
            multiline
            value={body}
            onChangeText={setBody}
          />
        </View>

        {/* Optional Image Picker */}
        <View style={styles.section}>
          <View style={styles.imageHeader}>
            <ImageIcon size={16} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Property Media Preset</Text>
          </View>
          <View style={styles.imagesRow}>
            {PRESET_IMAGES.map((img, idx) => {
              const isSelected = selectedImageIdx === idx;
              return (
                <TouchableOpacity
                  key={img.id}
                  style={[styles.imageCard, isSelected && styles.imageCardSelected]}
                  onPress={() => setSelectedImageIdx(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.imageCardText, isSelected && styles.imageCardTextActive]}>
                    {img.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkPill}>
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Plus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>Publish Property Listing</Text>
        </TouchableOpacity>
      </ScrollView>
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
    gap: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: Colors.text,
    fontSize: 14,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  locationInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  imageCard: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  imageCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  imageCardText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  imageCardTextActive: {
    color: Colors.primary,
  },
  checkPill: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
