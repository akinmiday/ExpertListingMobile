import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, MapPin, Tag, Check, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useApp, FeedTab } from '../context/AppContext';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { id: '1', name: 'Penthouse', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600' },
  { id: '2', name: 'Modern Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
  { id: '3', name: 'Luxury Pool', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' }
];

export default function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const { handleAddPost } = useApp();

  const [body, setBody] = useState('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [category, setCategory] = useState<Exclude<FeedTab, 'All'>>('General');
  const [listingType, setListingType] = useState<'For Rent' | 'For Sale' | undefined>(undefined);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!body.trim()) {
      Alert.alert('Error', 'Please enter some text for your post.');
      return;
    }

    const imageUrl = selectedImageIdx !== null ? PRESET_IMAGES[selectedImageIdx].url : undefined;

    handleAddPost(
      body,
      location,
      category,
      category === 'Property' || category === 'Request' ? listingType : undefined,
      imageUrl
    );

    // Reset fields
    setBody('');
    setLocation('Lekki Phase 1, Lagos');
    setCategory('General');
    setListingType(undefined);
    setSelectedImageIdx(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.indicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Listing Post</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {/* multiline text editor */}
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind? Share property updates or requests..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={body}
              onChangeText={setBody}
            />

            {/* Category selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.tabRow}>
                {(['Property', 'General', 'Request'] as Exclude<FeedTab, 'All'>[]).map((cat) => {
                  const isActive = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.tabButton, isActive && styles.tabButtonActive]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Listing Type option (Only if Property or Request) */}
            {(category === 'Property' || category === 'Request') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Listing Type</Text>
                <View style={styles.tabRow}>
                  <TouchableOpacity
                    style={[styles.tabButton, listingType === 'For Rent' && styles.tabButtonActive]}
                    onPress={() => setListingType(listingType === 'For Rent' ? undefined : 'For Rent')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabText, listingType === 'For Rent' && styles.tabTextActive]}>
                      For Rent
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, listingType === 'For Sale' && styles.tabButtonActive]}
                    onPress={() => setListingType(listingType === 'For Sale' ? undefined : 'For Sale')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabText, listingType === 'For Sale' && styles.tabTextActive]}>
                      For Sale
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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

            {/* Optional Image Picker */}
            <View style={styles.section}>
              <View style={styles.imageHeader}>
                <ImageIcon size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Add Media (Optional Presets)</Text>
              </View>
              <View style={styles.imagesRow}>
                {PRESET_IMAGES.map((img, idx) => {
                  const isSelected = selectedImageIdx === idx;
                  return (
                    <TouchableOpacity
                      key={img.id}
                      style={[styles.imageCard, isSelected && styles.imageCardSelected]}
                      onPress={() => setSelectedImageIdx(isSelected ? null : idx)}
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
          </ScrollView>

          {/* Action button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>Publish Listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 18,
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: Colors.text,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
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
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  locationInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
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
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.modalBg,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
