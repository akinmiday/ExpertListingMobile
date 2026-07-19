// API Client with local mock fallback
import { Colors } from '../theme/colors';
import { Platform } from 'react-native';

const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

let BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || DEFAULT_URL;

// Dynamically map localhost / 127.0.0.1 to 10.0.2.2 on Android emulator
if (Platform.OS === 'android') {
  if (BACKEND_URL.includes('localhost')) {
    BACKEND_URL = BACKEND_URL.replace('localhost', '10.0.2.2');
  } else if (BACKEND_URL.includes('127.0.0.1')) {
    BACKEND_URL = BACKEND_URL.replace('127.0.0.1', '10.0.2.2');
  }
}

// Light in-memory client-side cache
interface CacheEntry {
  data: Post[];
  timestamp: number;
}
const clientCache: Record<string, CacheEntry> = {};
const CACHE_DURATION_MS = 5000; // 5 seconds


export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'Individual' | 'Developer' | 'Agent' | 'Broker';
  hasStatus?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'Property' | 'General' | 'Request';
  body: string;
  location: string;
  listingType?: 'For Rent' | 'For Sale';
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: string; // for videos, e.g. "0:20"
  }[];
  likesCount: number;
  commentsCount: number;
  bookmarksCount?: number;
  bookmarked?: boolean;
  likedByUser?: boolean;
  likedBy: { name: string; username: string }[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  body: string;
  createdAt: string;
}

// -------------------------------------------------------------
// LOCAL MOCK STATE - fallback when backend server is unreachable
// -------------------------------------------------------------
const MOCK_USERS: Record<string, User> = {
  '1': { id: '1', name: 'Maurice U', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Individual' },
  '2': { id: '2', name: 'Boyd From', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Developer', hasStatus: true },
  '3': { id: '3', name: 'Stranger Dan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', role: 'Agent' },
  '4': { id: '4', name: 'Felix Okon', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', role: 'Broker' },
  'currentUser': { id: 'currentUser', name: 'Miracle H', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Individual' }
};

let mockPosts: Post[] = [
  {
    id: 'post-1',
    userId: '1',
    user: MOCK_USERS['1'],
    type: 'General',
    body: 'How is everyone holding up with the flooding in Lekki this week? Stay safe out there — and let me know if anyone needs a temporary place to crash 🙏',
    location: 'Lekki Phase 1, Lagos',
    likesCount: 8,
    commentsCount: 8,
    bookmarksCount: 2,
    likedByUser: false,
    likedBy: [
      { name: 'Miracle H', username: 'miracle.h' },
      { name: 'Alex Johnson', username: 'alex.j' },
      { name: 'Jordan Smith', username: 'jordan.s' }
    ],
    createdAt: 'Just Now'
  },
  {
    id: 'post-2',
    userId: '2',
    user: MOCK_USERS['2'],
    type: 'Property',
    body: 'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos',
    listingType: 'For Rent',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'
      }
    ],
    likesCount: 23,
    commentsCount: 0,
    bookmarksCount: 2,
    likedByUser: false,
    likedBy: [
      { name: 'Miracle H', username: 'miracle.h' },
      { name: 'Taylor Swift', username: 'taylor.s' }
    ],
    createdAt: '2h'
  },
  {
    id: 'post-3',
    userId: '3',
    user: MOCK_USERS['3'],
    type: 'General',
    body: 'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos',
    listingType: 'For Sale',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'
      }
    ],
    likesCount: 23,
    commentsCount: 3,
    bookmarksCount: 2,
    likedByUser: false,
    likedBy: [
      { name: 'Miracle H', username: 'miracle.h' },
      { name: 'Jamie Lannister', username: 'jamie.l' }
    ],
    createdAt: '20m'
  },
  {
    id: 'post-4',
    userId: '4',
    user: MOCK_USERS['4'],
    type: 'Property',
    body: 'New 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month. serviced apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos',
    listingType: 'For Sale',
    media: [
      {
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-40545-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600',
        duration: '0:20'
      }
    ],
    likesCount: 1,
    commentsCount: 0,
    likedByUser: false,
    likedBy: [
      { name: 'Miracle H', username: 'miracle.h' }
    ],
    createdAt: '21h'
  }
];

export function insertMockPost(post: Post) {
  mockPosts.unshift(post);
}

let mockComments: Record<string, Comment[]> = {
  'post-1': [
    {
      id: 'comment-1-1',
      postId: 'post-1',
      userId: '2',
      user: MOCK_USERS['2'],
      body: 'Stay safe Maurice! The flooding is really terrible this year.',
      createdAt: '10m ago'
    },
    {
      id: 'comment-1-2',
      postId: 'post-1',
      userId: '3',
      user: MOCK_USERS['3'],
      body: 'Thanks for looking out for the community.',
      createdAt: '5m ago'
    }
  ],
  'post-2': [
    {
      id: 'comment-2-1',
      postId: 'post-2',
      userId: '1',
      user: MOCK_USERS['1'],
      body: 'What is the pricing on this? DM me.',
      createdAt: '1h ago'
    }
  ],
  'post-3': [
    {
      id: 'comment-3-1',
      postId: 'post-3',
      userId: '4',
      user: MOCK_USERS['4'],
      body: 'Beautiful property Dan!',
      createdAt: '15m ago'
    }
  ]
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

export async function fetchPostsFromAPI(filters: {
  tab?: 'Property' | 'General' | 'Request' | 'All';
  location?: string;
  type?: 'For Rent' | 'For Sale' | 'All';
  search?: string;
}): Promise<Post[]> {
  const cacheKey = JSON.stringify(filters);
  const now = Date.now();
  if (clientCache[cacheKey] && now - clientCache[cacheKey].timestamp < CACHE_DURATION_MS) {
    console.log('Returning cached mobile feed results for key:', cacheKey);
    return clientCache[cacheKey].data;
  }

  try {
    const queryParams = new URLSearchParams();
    if (filters.tab && filters.tab !== 'All') queryParams.append('tab', filters.tab);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await fetch(`${BACKEND_URL}/posts?${queryParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      clientCache[cacheKey] = { data, timestamp: now };
      return data;
    }
  } catch (error) {
    console.log('API call fetchPosts failed, using local mock storage:', error);
  }

  // Fallback to local mock state
  let result = [...mockPosts];

  if (filters.tab && filters.tab !== 'All') {
    result = result.filter(p => p.type.toLowerCase() === filters.tab?.toLowerCase());
  }

  if (filters.location) {
    result = result.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()));
  }

  if (filters.type && filters.type !== 'All') {
    result = result.filter(p => p.listingType === filters.type);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(p => 
      p.body.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      p.user.name.toLowerCase().includes(searchLower)
    );
  }

  return result;
}

export async function toggleLikePost(postId: string): Promise<{ success: boolean; likesCount: number; likedByUser: boolean }> {
  try {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API call toggleLikePost failed, using local mock storage:', error);
  }

  // Fallback to local mock
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    if (post.likedByUser) {
      post.likedByUser = false;
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.likedBy = post.likedBy.filter(u => u.username !== 'miracle.h');
    } else {
      post.likedByUser = true;
      post.likesCount += 1;
      post.likedBy = [{ name: 'Miracle H', username: 'miracle.h' }, ...post.likedBy];
    }
    return { success: true, likesCount: post.likesCount, likedByUser: post.likedByUser };
  }
  return { success: false, likesCount: 0, likedByUser: false };
}

export async function fetchCommentsFromAPI(postId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API call fetchComments failed, using local mock storage:', error);
  }

  // Fallback to local mock
  return mockComments[postId] || [];
}

export async function addCommentToAPI(postId: string, text: string): Promise<Comment> {
  const newCommentBody = {
    text,
    userId: 'currentUser' // hardcoded or mocked "current user"
  };

  try {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCommentBody)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API call addComment failed, using local mock storage:', error);
  }

  // Fallback to local mock
  const newComment: Comment = {
    id: `comment-${postId}-${Date.now()}`,
    postId,
    userId: 'currentUser',
    user: MOCK_USERS['currentUser'],
    body: text,
    createdAt: 'Just Now'
  };

  if (!mockComments[postId]) {
    mockComments[postId] = [];
  }
  mockComments[postId].push(newComment);

  // Update comment count on post
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.commentsCount += 1;
  }

  return newComment;
}

export async function addPostToAPI(postData: {
  body: string;
  location: string;
  type: string;
  listingType?: string;
  media?: { type: 'image' | 'video'; url: string }[];
}): Promise<{ success: boolean; id: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API call addPostToAPI failed:', error);
  }
  return { success: false, id: `post-user-${Date.now()}` };
}

export const STORIES_DATA = [
  { id: '1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { id: '2', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { id: '3', name: 'Taylor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { id: '4', name: 'Jamie', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { id: '5', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { id: '6', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' }
];

export const TRENDING_LOCATIONS = [
  'Lekki Phase 1, Lagos',
  'Ikoyi, Lagos',
  'Victoria Island, Lagos',
  'Ikeja, Lagos',
  'Yaba, Lagos'
];

export const HOT_REQUESTS = [
  '3 Bedroom Apartment in Lekki',
  'Shared Office Space Yaba',
  'Shortlet duplex Victoria Island',
  'Land for Sale in Ibeju Lekki'
];

export const TOP_COMMUNITIES = [
  'Lekki Landlords Association',
  'Lagos Tech Hub Coworkers',
  'Real Estate Investors NG',
  'Yaba Tech Founders'
];
