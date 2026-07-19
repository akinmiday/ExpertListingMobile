import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Home, UserPlus, Trash2, CheckCheck } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'listing' | 'follow';
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'like',
    user: { name: 'Maurice U', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    text: 'liked your post about Lekki flooding safety.',
    time: '5m ago',
    read: false,
  },
  {
    id: 'n-2',
    type: 'comment',
    user: { name: 'Boyd From', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    text: 'commented: "Is inspection open to developers?" on your listing.',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n-3',
    type: 'listing',
    user: { name: 'Stranger Dan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    text: 'posted a new For Sale listing: 3-Bedroom Apartment.',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n-4',
    type: 'follow',
    user: { name: 'Felix Okon', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    text: 'started following your property updates.',
    time: '1d ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: () => setNotifications([]), style: 'destructive' },
      ]
    );
  };

  const toggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderIconBadge = (type: NotificationItem['type']) => {
    const iconSize = 12;
    switch (type) {
      case 'like':
        return (
          <View style={[styles.iconBadge, { backgroundColor: '#EF4444' }]}>
            <Heart size={iconSize} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        );
      case 'comment':
        return (
          <View style={[styles.iconBadge, { backgroundColor: Colors.primary }]}>
            <MessageCircle size={iconSize} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        );
      case 'listing':
        return (
          <View style={[styles.iconBadge, { backgroundColor: Colors.secondary }]}>
            <Home size={iconSize} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        );
      case 'follow':
        return (
          <View style={[styles.iconBadge, { backgroundColor: '#F59E0B' }]}>
            <UserPlus size={iconSize} color="#FFFFFF" />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      {notifications.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <CheckCheck size={16} color={Colors.primary} />
            <Text style={[styles.actionText, { color: Colors.primary }]}>Mark all read</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={clearAll}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, !item.read && styles.rowUnread]}
            activeOpacity={0.8}
            onPress={() => toggleRead(item.id)}
          >
            {/* Avatar Stack */}
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
              {renderIconBadge(item.type)}
            </View>

            {/* Notification Text */}
            <View style={styles.textContainer}>
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{item.user.name}</Text> {item.text}
              </Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>

            {/* Unread indicator */}
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellIconPlaceholder />
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubtext}>We'll notify you when someone interacts with your posts or profile.</Text>
          </View>
        }
      />
    </View>
  );
}

// Small inline placeholder icon layout
function BellIconPlaceholder() {
  return (
    <View style={styles.bellPlaceholder}>
      <View style={styles.bellRing} />
      <View style={styles.bellDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  rowUnread: {
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  notificationText: {
    color: Colors.textMuted,
    fontSize: 13.5,
    lineHeight: 18,
  },
  userName: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  emptyContainer: {
    paddingVertical: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 16,
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  bellPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bellRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textMuted,
  },
  bellDot: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
