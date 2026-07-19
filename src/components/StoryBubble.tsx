import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { STORIES_DATA } from '../api/client';

interface StoryBubbleProps {
  onPressStory: (userId: string) => void;
}

export default function StoryBubble({ onPressStory }: StoryBubbleProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={STORIES_DATA}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.storyContainer} 
            activeOpacity={0.8}
            onPress={() => onPressStory(item.id)}
          >
            <View style={styles.avatarRing}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyContainer: {
    alignItems: 'center',
    width: 64,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary, // gradient border simulator
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.card,
  },
  nameText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
});
