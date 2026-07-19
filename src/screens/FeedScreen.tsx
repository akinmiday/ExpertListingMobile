import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { STORIES_DATA } from '../api/client';
import StoryBubble from '../components/StoryBubble';
import PostCard from '../components/PostCard';
import CommentsModal from '../components/CommentsModal';
import StoryViewerModal from '../components/StoryViewerModal';
import CreateFeedPostModal from '../components/CreateFeedPostModal';

export default function FeedScreen() {
  const { posts, loading, refreshPosts } = useApp();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  
  // Stories state
  const [storyUserId, setStoryUserId] = useState<string | null>(null);
  const [storyVisible, setStoryVisible] = useState(false);

  // General feed post state
  const [createFeedPostVisible, setCreateFeedPostVisible] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setCommentsVisible(true);
  };

  const handleCloseComments = () => {
    setCommentsVisible(false);
    setSelectedPostId(null);
  };

  const handleOpenStory = (userId: string) => {
    setStoryUserId(userId);
    setStoryVisible(true);
  };

  const handleCloseStory = () => {
    setStoryVisible(false);
    setStoryUserId(null);
  };

  const handleNextStory = () => {
    if (!storyUserId) return;
    const currentIndex = STORIES_DATA.findIndex(s => s.id === storyUserId);
    if (currentIndex !== -1 && currentIndex < STORIES_DATA.length - 1) {
      setStoryUserId(STORIES_DATA[currentIndex + 1].id);
    } else {
      handleCloseStory();
    }
  };

  const handlePrevStory = () => {
    if (!storyUserId) return;
    const currentIndex = STORIES_DATA.findIndex(s => s.id === storyUserId);
    if (currentIndex > 0) {
      setStoryUserId(STORIES_DATA[currentIndex - 1].id);
    }
  };

  const renderHeader = () => (
    <View>
      <StoryBubble onPressStory={handleOpenStory} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <PostCard post={item} onOpenComments={handleOpenComments} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts match this filter.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => setCreateFeedPostVisible(true)}
      >
        <Plus size={24} color="#FFF" strokeWidth={3} />
      </TouchableOpacity>

      {/* Comments Slide-up Modal */}
      <CommentsModal
        postId={selectedPostId}
        visible={commentsVisible}
        onClose={handleCloseComments}
      />

      {/* Story Fullscreen Viewer */}
      <StoryViewerModal
        userId={storyUserId}
        visible={storyVisible}
        onClose={handleCloseStory}
        onNext={handleNextStory}
        onPrev={handlePrevStory}
      />

      {/* Create Feed Post Modal */}
      <CreateFeedPostModal
        visible={createFeedPostVisible}
        onClose={() => setCreateFeedPostVisible(false)}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80, // Space for FAB and tab bar
  },
  emptyContainer: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
