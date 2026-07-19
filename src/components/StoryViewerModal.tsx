import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { STORIES_DATA } from '../api/client';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryViewerModalProps {
  userId: string | null;
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const STORY_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', // Alex: modern living room
  '2': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', // Jordan: luxury pool villa
  '3': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', // Taylor: bedroom
  '4': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', // Jamie: commercial office
  '5': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', // Jordan: garden house
  '6': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800', // Emma: kitchen design
};

export default function StoryViewerModal({ userId, visible, onClose, onNext, onPrev }: StoryViewerModalProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const storyUser = STORIES_DATA.find((u) => u.id === userId);
  const storyImage = userId ? STORY_IMAGES[userId] || STORY_IMAGES['1'] : STORY_IMAGES['1'];

  useEffect(() => {
    if (visible && userId) {
      // Reset animation
      progressAnim.setValue(0);
      
      // Start progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 4000, // 4 seconds story duration
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          onNext();
        }
      });
    }

    return () => {
      progressAnim.stopAnimation();
    };
  }, [visible, userId]);

  if (!storyUser) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Fullscreen Story Image */}
        <Image source={{ uri: storyImage }} style={styles.storyImage} contentFit="cover" />

        {/* Tap Targets - split 35/65 screen width */}
        <TouchableOpacity style={styles.tapTargetLeft} onPress={onPrev} activeOpacity={1} />
        <TouchableOpacity style={styles.tapTargetRight} onPress={onNext} activeOpacity={1} />

        {/* Dark overlay at top for readability */}
        <View style={styles.topGradient} />

        {/* Content Container (Overlay) */}
        <View style={styles.contentOverlay} pointerEvents="box-none">
          {/* Multi-segmented Progress Bar */}
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} 
            />
          </View>

          {/* Story Header (User Info) */}
          <View style={styles.header} pointerEvents="box-none">
            <View style={styles.userInfo}>
              <Image source={{ uri: storyUser.avatar }} style={styles.avatar} />
              <View style={styles.userMeta}>
                <Text style={styles.userName}>{storyUser.name}</Text>
                <Text style={styles.timeText}>2h ago • Status Update</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tapTargetLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  tapTargetRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  storyImage: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentOverlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    gap: 16,
    zIndex: 10,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userMeta: {
    justifyContent: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
});
