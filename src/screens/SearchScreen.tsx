import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, X, TrendingUp, Compass, MessageSquare } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Post, fetchPostsFromAPI } from '../api/client';
import PostCard from '../components/PostCard';
import CommentsModal from '../components/CommentsModal';

const TRENDING_SEARCHES = ['Lekki', 'For Rent', '3 Bedroom', 'For Sale', 'Yaba', 'Apartment'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchPosts = async () => {
    setLoading(true);
    try {
      const posts = await fetchPostsFromAPI({ search: query });
      setResults(posts);
    } catch (e) {
      console.error('Failed to search posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingPress = (term: string) => {
    setQuery(term);
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setCommentsVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by keywords, location, developer..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearIcon}>
              <X size={16} color={Colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Area */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : query === '' ? (
        // Trending View
        <View style={styles.trendingContainer}>
          <View style={styles.trendingHeader}>
            <TrendingUp size={16} color={Colors.primary} />
            <Text style={styles.trendingTitle}>Trending Searches</Text>
          </View>
          <View style={styles.tagsContainer}>
            {TRENDING_SEARCHES.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.tag}
                onPress={() => handleTrendingPress(term)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.explorePlaceholder}>
            <Compass size={40} color={Colors.border} style={{ marginBottom: 12 }} />
            <Text style={styles.exploreText}>Find properties, community updates, and requests instantly.</Text>
          </View>
        </View>
      ) : (
        // Search Results List
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} onOpenComments={handleOpenComments} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MessageSquare size={36} color={Colors.border} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No listings match "{query}"</Text>
              <Text style={styles.emptySubtext}>Try adjusting your keywords or checking spelling.</Text>
            </View>
          }
        />
      )}

      {/* Comments Slide-up Modal */}
      <CommentsModal
        postId={selectedPostId}
        visible={commentsVisible}
        onClose={() => {
          setCommentsVisible(false);
          setSelectedPostId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  clearIcon: {
    padding: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingContainer: {
    padding: 20,
    gap: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendingTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  explorePlaceholder: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  exploreText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
