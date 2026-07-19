# Expert Listing — Mobile App

This is the mobile app for Expert Listing. It uses React Native and Expo.

---

## Requirements

- Node.js version 18 or later
- Expo CLI, or use `npx expo` directly
- For Android: Android Studio with an emulator, or a device with Expo Go
- For iOS: Xcode with a simulator, or a device with Expo Go
- The backend server must run at `http://localhost:3000`

---

## How to Run

**Step 1.** Install the packages.
```bash
npm install
```

**Step 2.** Create the environment file.
```bash
cp .env.example .env
```
Open the `.env` file. Set `EXPO_PUBLIC_BACKEND_URL` to your server address.

**Step 3.** Start the Expo server.
```bash
npx expo start -c
```

Press `a` to open the Android emulator. Press `i` to open the iOS simulator. You can also scan the QR code with Expo Go on your device.

---

## Environment File

Create a `.env` file in the root folder.

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

> The app detects Android at startup. It replaces `localhost` with `10.0.2.2`. This address points to the host machine from an Android emulator. You do not need a separate value for Android.

---

## Screens

| Screen | Description |
|--------|-------------|
| **Feed** | The main feed. Shows posts from the backend. |
| **Search** | Placeholder. Not built. |
| **List** | Create a new post. Sends data to `POST /posts`. |
| **Notifications** | Placeholder. Not built. |
| **Profile** | Placeholder. Not built. |

---

## Features

### Feed Tabs

Three tabs appear at the top of the feed: **Property**, **General**, and **Request**.

Tap a tab to filter the feed. The app sends `GET /posts?tab=<type>` to the server. The feed updates with the result.

### Post Card

Each post card shows:
- The author avatar with an optional online ring
- The author role (Agent, Developer, Broker, or Individual)
- The post text
- The location
- A tag that shows **For Rent** or **For Sale**
- An image carousel with dot indicators
- A video card with a play button and a duration label
- Action buttons: Like, Comment, Share, Bookmark
- A row that shows which users liked the post

### Likes

Tap the heart to like or unlike a post.

The count updates immediately on screen. The app then sends `POST /posts/:id/like` in the background. If the request fails, the count returns to the previous value.

### Comments

Tap the comment icon to open the comments panel.

The panel slides up from the bottom. The app loads comments from `GET /posts/:id/comments`. Type a comment and tap Send. The app sends `POST /posts/:id/comments`. The new comment appears immediately.

### Sidebar Filters

Tap the menu icon in the header to open the sidebar.

The sidebar shows:
- **Feed Category** — switch between Property, General, and Request
- **Listing Type** — filter by For Rent or For Sale
- **Trending Locations** — filter the feed by location
- **Hot Requests** — a static list of common requests
- **Top Communities** — a static list of communities
- **Clear All Filters** — remove all active filters

---

## File Structure

```
src/
  api/
    client.ts           — API calls, URL setup, and client cache
  components/
    CommentsModal.tsx
    FeedTabs.tsx
    Header.tsx
    PostCard.tsx        — Uses React.memo for scroll performance
    SidebarContent.tsx
  context/
    AppContext.tsx      — Global state for posts and filters
  navigation/
    DrawerNavigator.tsx
    TabNavigator.tsx
  screens/
    CreatePostScreen.tsx
    FeedScreen.tsx
    NotificationsScreen.tsx
    ProfileScreen.tsx
    SearchScreen.tsx
  theme/
    colors.ts           — Color tokens
```

---

## Performance Choices

| Choice | Reason |
|--------|--------|
| `React.memo` on PostCard | The card does not re-render when its data does not change. This keeps scroll smooth at 60 frames per second. |
| `expo-image` | It caches images to disk and decodes them faster than the standard Image component. |
| 5-second client cache | Switching tabs reuses the last response for 5 seconds. This reduces network calls. |
| Optimistic UI for likes | The screen updates before the server responds. The user sees no delay. |
| API fallback to mock data | If the server is not reachable, the app shows local data. The screen is never blank. |

---

## What Was Not Built

| Item | Reason |
|------|--------|
| Authentication | Out of scope. The current user is always `"currentUser"`. |
| Email verification | Out of scope. |
| Payments | Out of scope. |
| Push notifications | Out of scope. The Notifications screen is a placeholder. |
| Search screen | Out of scope. The backend supports search, but the UI is not built. |
| Profile screen | Out of scope. |
| Image and video upload | Out of scope. Media is stored as URL strings. |
| FlashList | Not used. FlatList with React.memo is enough for this scale. |
| WebSocket updates | Not built. Likes and comments return updated counts on each request. |
| Offline storage | Not built. The 5-second cache and mock fallback reduce the effect of network failures. |
