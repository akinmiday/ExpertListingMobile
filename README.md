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

**Step 2.** Configure the environment file.
Verify that the `.env` file exists in the root folder, and set `EXPO_PUBLIC_BACKEND_URL` to your backend server URL.

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
| **Feed** | The main feed. Shows posts from the backend and supports sidebar filter drawers. |
| **Search** | Fully functional debounced search bar. Queries backend by body text, locations, or usernames. |
| **List** | Create new property listings, requests, or general posts directly onto the backend. |
| **Notifications** | Displays mock follow, comment, and like feeds. Supports read status toggles and delete all flows. |
| **Profile** | Settings dashboard for password updates, legal policy modals, and secure logout triggers. |

---

## Features

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
| Push notifications | Out of scope. Notifications are simulated locally. |
| Image and video upload | Out of scope. Media is stored as URL strings. |
| FlashList | Not used. FlatList with React.memo is enough for this scale. |
| WebSocket updates | Not built. Likes and comments return updated counts on each request. |
| Offline storage | Not built. The 5-second cache and mock fallback reduce the effect of network failures. |

---

## Design Improvisations & Implementation Decisions

The Figma file only provided visual styles for the main feed (specifically the Property tab). The designs, layouts, and interactive behaviors for all other tabs (General and Request) and screens (Search, List/Create Post, Notifications, and Profile) were custom-designed and implemented to match the aesthetics, color palette, and typography of the main feed:

### 1. The Sidebar (Drawer)
- **Problem**: There was no sidebar layout in the Figma file.
- **Solution**: We created a custom drawer sidebar containing:
  - **Feed Category selector**: Easily switch tab categories.
  - **Listing Type filter**: Fast filtering for For Rent or For Sale properties.
  - **Trending Locations**: Clicking a location filters the main feed dynamically.
  - **Hot Requests & Top Communities**: Interactive sidebar items that close the drawer and update context filters where matching.
- **Nesting**: Improvised by nesting the `DrawerNavigator` inside the `Feed` screen of the `TabNavigator` so that the bottom tab bar and header navigation are preserved and the drawer fits "within the app" boundaries.

### 2. Search Screen
- A full-featured search interface containing a search input bar, trending search tag shortcuts, and debounced text inputs that call the backend dynamically to fetch matching user names, listing details, or location matches.

### 3. List Screen (Create Post)
- A complete visual form screen for listing property, general posts, or requests. Contains form validation, type toggle tabs, location fields, and handles direct API integration with `POST /posts`.

### 4. Notifications Screen
- Displays a list of simulated notifications (likes, comments, new listings, follows) with mark-as-read toggles, visual status badges, and a "Clear All" alert verification flow.

### 5. Profile Screen
- A dashboard screen for settings, user roles, simulated passwords change modals, terms and conditions view overlays, and logout safety prompts.

---

## EAS Build Configuration (Android APK)

We have initialized and configured EAS Build for this project.

### 1. Build Profile
The `eas.json` file is configured with the following profiles:
- **`preview`**: Generates a direct installable `.apk` file for testing on physical devices or emulators, and defaults to standard local API endpoints (`http://localhost:3000`).
- **`production`**: Generates a direct installable `.apk` file for release builds and links to your production API endpoints.

### 2. ProGuard & Optimization
- **`expo-build-properties`**: Configured inside the `plugins` array of `app.json` with `"enableProguardInReleaseBuilds": true`. This instructs the EAS compiler to run **R8/ProGuard** code shrinking, obfuscating, and optimization algorithms on release builds.
- **`versionCode`**: Configured inside the `android` block of `app.json` (set to `1`) as required by Google Play to identify newer releases.

### 3. Environment Variables Configuration
The `eas.json` contains a specific `env` configuration to embed `EXPO_PUBLIC_BACKEND_URL` directly into the built binary during EAS compilation:
- To customize the production backend endpoint, edit the `EXPO_PUBLIC_BACKEND_URL` value inside the `"production"` block of your `eas.json` before building.

### 4. Run EAS Build Commands
Make sure you have global `eas-cli` installed and are logged in, then run:
- **To build a preview Android APK**:
  ```bash
  eas build --platform android --profile preview
  ```
- **To build a production Android APK**:
  ```bash
  eas build --platform android --profile production
  ```
