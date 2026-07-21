import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Lock, FileText, ShieldAlert, LogOut, ChevronRight, X, Save } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been changed successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Expert Listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => Alert.alert('Logged Out', 'Successfully logged out.'), style: 'destructive' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>Miracle H</Text>
        <Text style={styles.usernameText}>@miracle.h</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Individual</Text>
        </View>
      </View>

      {/* Menu Settings */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionHeader}>Settings & Legal</Text>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => setChangePasswordVisible(true)}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Lock size={18} color="#3B82F6" />
            </View>
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => setTermsVisible(true)}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <FileText size={18} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Terms & Conditions</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => setPrivacyVisible(true)}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <ShieldAlert size={18} color="#F59E0B" />
            </View>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <LogOut size={18} color="#EF4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Log Out</Text>
          </View>
          <ChevronRight size={18} color="#EF4444" style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      </View>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordVisible}
        onRequestClose={() => setChangePasswordVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setChangePasswordVisible(false)} 
          />
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor={Colors.textMuted}
                value={oldPassword}
                onChangeText={setOldPassword}
              />

              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor={Colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor={Colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.8}
                onPress={handleChangePassword}
              >
                <Save size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* TERMS & CONDITIONS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={termsVisible}
        onRequestClose={() => setTermsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setTermsVisible(false)} 
          />
          <View style={[styles.modalContent, styles.fullModalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <TouchableOpacity onPress={() => setTermsVisible(false)}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.legalHeader}>1. Acceptance of Terms</Text>
              <Text style={styles.legalBody}>
                By downloading, accessing, or using the Expert Listing application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this app.
              </Text>
              <Text style={styles.legalHeader}>2. Platform Rules & Post Listings</Text>
              <Text style={styles.legalBody}>
                Users are solely responsible for all details posted, including property conditions, specifications, photos, and descriptions. Misleading postings, fraudulent requests, or violation of local rental guidelines are strictly prohibited and will result in suspension.
              </Text>
              <Text style={styles.legalHeader}>3. Communication & Safety</Text>
              <Text style={styles.legalBody}>
                We do not complete transactions, verify payment details, or guarantee tenant/landlord background validation. Verify credentials offline before completing agreements.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PRIVACY POLICY MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={privacyVisible}
        onRequestClose={() => setPrivacyVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setPrivacyVisible(false)} 
          />
          <View style={[styles.modalContent, styles.fullModalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyVisible(false)}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.legalHeader}>1. Data Collection</Text>
              <Text style={styles.legalBody}>
                We collect personal profile data (username, avatar, email) when users register, along with likes, bookmarks, and comments submitted in the feed.
              </Text>
              <Text style={styles.legalHeader}>2. Location Data</Text>
              <Text style={styles.legalBody}>
                The app collects location search variables (e.g. searching "Lekki") to narrow feed filtering. Real-time background GPS details are not tracked without permission.
              </Text>
              <Text style={styles.legalHeader}>3. Data Security & Sharing</Text>
              <Text style={styles.legalBody}>
                We implement caching layers and database safeguards. We do not sell user data to advertising entities. Interactions are shared inside our network feed for platform functionality.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  nameText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  usernameText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: Colors.tagRentBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  menuContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  fullModalContent: {
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalForm: {
    gap: 12,
  },
  inputLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    padding: 12,
    color: Colors.text,
    fontSize: 14,
    marginBottom: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalBody: {
    flex: 1,
  },
  legalHeader: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  legalBody: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
