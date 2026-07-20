import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Post, Comment, fetchPostsFromAPI, toggleLikePost, fetchCommentsFromAPI, addCommentToAPI, addPostToAPI, deletePostAPI } from '../api/client';

export type FeedTab = 'Property' | 'General' | 'Request' | 'All';
export type ListingType = 'For Rent' | 'For Sale' | 'All';

interface Filters {
  tab: FeedTab;
  location?: string;
  type: ListingType;
  search?: string;
}

interface AppContextType {
  posts: Post[];
  loading: boolean;
  filters: Filters;
  createPostVisible: boolean;
  setCreatePostVisible: (visible: boolean) => void;
  setTab: (tab: FeedTab) => void;
  setLocationFilter: (location?: string) => void;
  setTypeFilter: (type: ListingType) => void;
  setSearchQuery: (query?: string) => void;
  clearFilters: () => void;
  handleLike: (postId: string) => Promise<void>;
  handleLoadComments: (postId: string) => Promise<Comment[]>;
  handleAddComment: (postId: string, text: string) => Promise<Comment | null>;
  handleAddPost: (body: string, location: string, tab: FeedTab, listingType?: 'For Rent' | 'For Sale', imageUrl?: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  handleDeletePost: (postId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createPostVisible, setCreatePostVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    tab: 'All',
    location: undefined,
    type: 'All',
    search: undefined
  });

  const loadPosts = useCallback(async (currentFilters: Filters, isRefreshing = false) => {
    setLoading(true);
    if (!isRefreshing) {
      setPosts([]);
    }
    try {
      const fetchedPosts = await fetchPostsFromAPI({
        tab: currentFilters.tab,
        location: currentFilters.location,
        type: currentFilters.type,
        search: currentFilters.search
      });
      setPosts(fetchedPosts);
    } catch (e) {
      console.error('Failed to load posts in AppContext:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Serialize filters to a stable string key so the effect only re-runs
  // when an actual filter value changes, not on object reference changes.
  const filtersKey = `${filters.tab}|${filters.location ?? ''}|${filters.type}|${filters.search ?? ''}`;

  // Reload posts when filters change
  useEffect(() => {
    loadPosts(filters);
  }, [filtersKey]);

  const refreshPosts = useCallback(async () => {
    await loadPosts(filters, true);
  }, [filters, loadPosts]);

  const setTab = (tab: FeedTab) => {
    setFilters(prev => ({ ...prev, tab }));
  };

  const setLocationFilter = (location?: string) => {
    setFilters(prev => ({ ...prev, location }));
  };

  const setTypeFilter = (type: ListingType) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const setSearchQuery = (search?: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({
      tab: 'All',
      location: undefined,
      type: 'All',
      search: undefined
    });
  };


  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const isLiked = p.likedByUser;
          const nextLikesCount = isLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1;
          const nextLikedBy = isLiked
            ? p.likedBy.filter(u => u.username !== 'miracle.h')
            : [{ name: 'Miracle H', username: 'miracle.h' }, ...p.likedBy];
          return {
            ...p,
            likedByUser: !isLiked,
            likesCount: nextLikesCount,
            likedBy: nextLikedBy
          };
        }
        return p;
      })
    );

    // Call API in background
    try {
      const result = await toggleLikePost(postId);
      if (result.success) {
        // Sync counts from server response
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                likesCount: result.likesCount,
                likedByUser: result.likedByUser
              };
            }
            return p;
          })
        );
      }
    } catch (e) {
      console.error('Failed to toggle like in AppContext:', e);
      // Revert if API failed (optional: simplicity first)
    }
  };

  const handleLoadComments = async (postId: string): Promise<Comment[]> => {
    try {
      return await fetchCommentsFromAPI(postId);
    } catch (e) {
      console.error('Failed to load comments:', e);
      return [];
    }
  };

  const handleAddComment = async (postId: string, text: string): Promise<Comment | null> => {
    if (!text.trim()) return null;
    try {
      const newComment = await addCommentToAPI(postId, text);
      // Update comment count on post
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              commentsCount: p.commentsCount + 1
            };
          }
          return p;
        })
      );
      return newComment;
    } catch (e) {
      console.error('Failed to add comment:', e);
      return null;
    }
  };

  const handleAddPost = async (
    body: string,
    location: string,
    tab: FeedTab,
    listingType?: 'For Rent' | 'For Sale',
    imageUrl?: string
  ) => {
    const postData = {
      body,
      location: location || 'Lekki Phase 1, Lagos',
      type: tab === 'All' ? 'General' : tab,
      listingType: listingType || undefined,
      media: imageUrl ? [{ type: 'image' as const, url: imageUrl }] : undefined
    };

    // Optimistically add to local state
    const tempId = `post-user-${Date.now()}`;
    const newPost: Post = {
      id: tempId,
      userId: 'currentUser',
      user: {
        id: 'currentUser',
        name: 'Miracle H',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'Individual'
      },
      type: postData.type as any,
      body: postData.body,
      location: postData.location,
      listingType: postData.listingType as any,
      media: postData.media,
      likesCount: 0,
      commentsCount: 0,
      bookmarksCount: 0,
      likedByUser: false,
      likedBy: [],
      createdAt: 'Just Now'
    };

    setPosts(prev => [newPost, ...prev]);

    try {
      const res = await addPostToAPI(postData);
      if (res.success) {
        // Sync actual ID from server
        setPosts(prev => prev.map(p => p.id === tempId ? { ...p, id: res.id } : p));
        // Refresh feed to ensure full server sync
        await refreshPosts();
      }
    } catch (e) {
      console.error('Failed to add post in AppContext:', e);
    }
  };

  const handleDeletePost = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.filter(p => p.id !== postId));

    try {
      const res = await deletePostAPI(postId);
      if (!res.success) {
        console.log('Post deletion failed on server, reloading feed');
        await refreshPosts();
      }
    } catch (e) {
      console.error('Failed to delete post:', e);
      await refreshPosts();
    }
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        loading,
        filters,
        setTab,
        setLocationFilter,
        setTypeFilter,
        setSearchQuery,
        clearFilters,
        handleLike,
        handleLoadComments,
        handleAddComment,
        handleAddPost,
        refreshPosts,
        handleDeletePost,
        createPostVisible,
        setCreatePostVisible
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
