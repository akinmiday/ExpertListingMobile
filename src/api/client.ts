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
  // ── PROPERTY
  {
    id: 'post-1', userId: '2', user: MOCK_USERS['2'],
    type: 'Property',
    body: 'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos', listingType: 'For Rent',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' }],
    likesCount: 3, commentsCount: 2, bookmarksCount: 2, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }, { name: 'Alex Johnson', username: 'alex.j' }],
    createdAt: '2h'
  },
  {
    id: 'post-2', userId: '4', user: MOCK_USERS['4'],
    type: 'Property',
    body: 'Premium 4-bedroom detached duplex with BQ, swimming pool, and perimeter fence. Price is negotiable for serious buyers.',
    location: 'Ikoyi, Lagos', listingType: 'For Sale',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600' }
    ],
    likesCount: 2, commentsCount: 1, bookmarksCount: 5, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }, { name: 'Taylor Swift', username: 'taylor.s' }],
    createdAt: '4h'
  },
  {
    id: 'post-3', userId: '3', user: MOCK_USERS['3'],
    type: 'Property',
    body: 'Executive 2-bedroom shortlet apartment. Available for daily, weekly and monthly stays. Ideal for corporate guests.',
    location: 'Victoria Island, Lagos', listingType: 'For Rent',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600' }
    ],
    likesCount: 2, commentsCount: 1, bookmarksCount: 3, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }, { name: 'Jamie Lannister', username: 'jamie.l' }],
    createdAt: '20m'
  },
  {
    id: 'post-4', userId: '2', user: MOCK_USERS['2'],
    type: 'Property',
    body: 'Cozy 1-bedroom self-contain apartment. Tiled floor, prepaid meter, running water. 6 months rent = ₦750,000.',
    location: 'Ikeja, Lagos', listingType: 'For Rent',
    media: [{
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-40545-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      duration: '0:20'
    }],
    likesCount: 1, commentsCount: 0, bookmarksCount: 1, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }],
    createdAt: '21h'
  },
  {
    id: 'post-5', userId: '1', user: MOCK_USERS['1'],
    type: 'Property',
    body: '3-bedroom terrace duplex in a gated estate. 24/7 security, gym, and rooftop lounge access included.',
    location: 'Yaba, Lagos', listingType: 'For Sale',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' }],
    likesCount: 0, commentsCount: 0, bookmarksCount: 0, likedByUser: false,
    likedBy: [],
    createdAt: '1d'
  },

  // ── GENERAL
  {
    id: 'post-6', userId: '1', user: MOCK_USERS['1'],
    type: 'General',
    body: 'How is everyone holding up with the flooding in Lekki this week? Stay safe out there — and let me know if anyone needs a temporary place to crash 🙏',
    location: 'Lekki Phase 1, Lagos',
    likesCount: 8, commentsCount: 2, bookmarksCount: 2, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }, { name: 'Alex Johnson', username: 'alex.j' }],
    createdAt: 'Just Now'
  },
  {
    id: 'post-7', userId: '3', user: MOCK_USERS['3'],
    type: 'General',
    body: 'The Lagos real estate market is finally stabilising after Q1 volatility. If you are a first-time buyer, now is a great time to enter. Happy to share my agent contacts.',
    location: 'Ikoyi, Lagos',
    likesCount: 1, commentsCount: 1, bookmarksCount: 4, likedByUser: false,
    likedBy: [{ name: 'Taylor Swift', username: 'taylor.s' }],
    createdAt: '3h'
  },
  {
    id: 'post-8', userId: '4', user: MOCK_USERS['4'],
    type: 'General',
    body: 'Quick reminder: always verify your agent on the LSREA portal before paying any commitment fees. Too many people are getting scammed right now.',
    location: 'Victoria Island, Lagos',
    likesCount: 1, commentsCount: 0, bookmarksCount: 7, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }],
    createdAt: '1h'
  },
  {
    id: 'post-9', userId: '2', user: MOCK_USERS['2'],
    type: 'General',
    body: 'Attended the PropTech Summit in Ikeja yesterday. The short-term rental market is growing at 34% YoY in Lagos. Big opportunity for investors.',
    location: 'Ikeja, Lagos',
    likesCount: 0, commentsCount: 0, bookmarksCount: 3, likedByUser: false,
    likedBy: [],
    createdAt: '5h'
  },
  {
    id: 'post-10', userId: '1', user: MOCK_USERS['1'],
    type: 'General',
    body: 'Yaba is quietly becoming the most sought-after tech-hub neighbourhood in Lagos. If you own land here, hold tight — the appreciation is just starting.',
    location: 'Yaba, Lagos',
    likesCount: 0, commentsCount: 0, bookmarksCount: 6, likedByUser: false,
    likedBy: [],
    createdAt: '2d'
  },

  // ── REQUEST
  {
    id: 'post-11', userId: 'currentUser', user: MOCK_USERS['currentUser'],
    type: 'Request',
    body: 'Looking for a 3-bedroom apartment in Lekki Phase 1. Budget: ₦3.5M/year. Must have 24/7 power, good security, and covered parking. DM me directly.',
    location: 'Lekki Phase 1, Lagos',
    likesCount: 1, commentsCount: 1, bookmarksCount: 0, likedByUser: false,
    likedBy: [{ name: 'Alex Johnson', username: 'alex.j' }],
    createdAt: '30m'
  },
  {
    id: 'post-12', userId: '1', user: MOCK_USERS['1'],
    type: 'Request',
    body: 'Anyone know a reliable plumber in Ikoyi? Need urgent help with burst pipes. Happy to pay same-day rates.',
    location: 'Ikoyi, Lagos',
    likesCount: 0, commentsCount: 0, bookmarksCount: 1, likedByUser: false,
    likedBy: [],
    createdAt: '45m'
  },
  {
    id: 'post-13', userId: '3', user: MOCK_USERS['3'],
    type: 'Request',
    body: 'Seeking shared office space in Victoria Island for a team of 6. Flexible lease (month-to-month preferred). Budget ₦500k/month all-in.',
    location: 'Victoria Island, Lagos',
    likesCount: 1, commentsCount: 1, bookmarksCount: 2, likedByUser: true,
    likedBy: [{ name: 'Miracle H', username: 'miracle.h' }],
    createdAt: '6h'
  },
  {
    id: 'post-14', userId: '4', user: MOCK_USERS['4'],
    type: 'Request',
    body: 'Looking for a 1-bedroom shortlet in Ikeja for 3 weeks. Must have strong WiFi and backup power. Starting 1st August.',
    location: 'Ikeja, Lagos',
    likesCount: 0, commentsCount: 0, bookmarksCount: 0, likedByUser: false,
    likedBy: [],
    createdAt: '8h'
  },
  {
    id: 'post-15', userId: '2', user: MOCK_USERS['2'],
    type: 'Request',
    body: 'Need a reliable moving company to help relocate furniture from Yaba to Lekki this weekend. Please drop contacts below 🙏',
    location: 'Yaba, Lagos',
    likesCount: 0, commentsCount: 0, bookmarksCount: 0, likedByUser: false,
    likedBy: [],
    createdAt: '10h'
  }
];

export function insertMockPost(post: Post) {
  mockPosts.unshift(post);
}

let mockComments: Record<string, Comment[]> = {
  'post-1': [
    { id: 'c-1-1', postId: 'post-1', userId: '1', user: MOCK_USERS['1'], body: 'What is the asking price? DM me.', createdAt: '1h ago' },
    { id: 'c-1-2', postId: 'post-1', userId: '3', user: MOCK_USERS['3'], body: 'Is parking covered or open-air?', createdAt: '30m ago' }
  ],
  'post-2': [
    { id: 'c-2-1', postId: 'post-2', userId: 'currentUser', user: MOCK_USERS['currentUser'], body: 'This is beautiful! Is there room to negotiate?', createdAt: '2h ago' }
  ],
  'post-3': [
    { id: 'c-3-1', postId: 'post-3', userId: '4', user: MOCK_USERS['4'], body: 'Do you offer weekly rates?', createdAt: '15m ago' }
  ],
  'post-6': [
    { id: 'c-6-1', postId: 'post-6', userId: '2', user: MOCK_USERS['2'], body: 'Stay safe Maurice! The flooding is really bad this year.', createdAt: '10m ago' },
    { id: 'c-6-2', postId: 'post-6', userId: '3', user: MOCK_USERS['3'], body: 'Thanks for looking out for the community.', createdAt: '5m ago' }
  ],
  'post-7': [
    { id: 'c-7-1', postId: 'post-7', userId: 'currentUser', user: MOCK_USERS['currentUser'], body: 'Would love those agent contacts if you are sharing!', createdAt: '1h ago' }
  ],
  'post-11': [
    { id: 'c-11-1', postId: 'post-11', userId: '2', user: MOCK_USERS['2'], body: 'I have something that might match. Sending you a DM.', createdAt: '20m ago' }
  ],
  'post-13': [
    { id: 'c-13-1', postId: 'post-13', userId: '4', user: MOCK_USERS['4'], body: 'We have a space in VI that fits. Will share details.', createdAt: '3h ago' }
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

export async function deletePostAPI(postId: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API call deletePostAPI failed, using local mock storage:', error);
  }

  // Fallback to local mock
  mockPosts = mockPosts.filter(p => p.id !== postId);
  return { success: true };
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
