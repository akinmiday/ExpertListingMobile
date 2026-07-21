import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, MapPin, Send } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useApp, FeedTab } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CreateFeedPostModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateFeedPostModal({ visible, onClose }: CreateFeedPostModalProps) {
  const { handleAddPost } = useApp();
  const insets = useSafeAreaInsets();

  const [body, setBody] = useState('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [category, setCategory] = useState<'General' | 'Request'>('General');

  const handleSubmit = () => {
    if (!body.trim()) {
      Alert.alert('Error', 'Please enter some text for your post.');
      return;
    }

    handleAddPost(
      body,
      location,
      category,
      undefined, // No listing type (e.g. For Rent / For Sale) for general feed posts
      undefined  // No image for text-based general feed posts
    );

    // Reset fields
    setBody('');
    setLocation('Lekki Phase 1, Lagos');
    setCategory('General');
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
        behavior="padding"
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.indicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New Feed Post</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {/* multiline text editor */}
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind? Share general posts or requests..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={body}
              onChangeText={setBody}
            />

            {/* Category selection - Restricted to General and Request */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.tabRow}>
                {(['General', 'Request'] as const).map((cat) => {
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
          </ScrollView>

          {/* Action button */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
              <Send size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Publish Post</Text>
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
    height: '70%',
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.modalBg,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
