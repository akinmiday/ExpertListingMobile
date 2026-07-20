import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Send, Bookmark, MapPin, MoreHorizontal, Play, Tag, ChevronRight, Phone, Calendar, Copy, AlertTriangle, Trash2 } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Post } from '../api/client';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = 220;

interface PostCardProps {
  post: Post;
  onOpenComments: (postId: string) => void;
}

function PostCard({ post, onOpenComments }: PostCardProps) {
  const { handleLike, handleDeletePost } = useApp();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked || false);
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount || 0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    setIsBookmarked(post.bookmarked || false);
    setBookmarksCount(post.bookmarksCount || 0);
  }, [post.bookmarked, post.bookmarksCount]);

  const handleCopyLink = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert('Link Copied', 'The link to this post has been copied to your clipboard!');
    }, 300);
  };

  const handleShare = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert('Shared', 'This post has been successfully shared!');
    }, 300);
  };

  const handleReport = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert('Post Reported', 'Thank you for keeping our community safe. We will review this post.');
    }, 300);
  };

  const handleContactAgent = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert(
        `Contact ${post.user.name}`,
        `Role: ${post.user.role}\nPhone: +234 803 123 4567\nEmail: contact@expertlisting.com`,
        [{ text: 'Close', style: 'cancel' }]
      );
    }, 300);
  };

  const handleRequestInspection = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Inspection Requested',
        'Your tour request has been sent to the agent. They will contact you shortly to schedule the date.'
      );
    }, 300);
  };

  const handleDeletePress = () => {
    setActionsVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this listing?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: () => handleDeletePost(post.id) 
          }
        ]
      );
    }, 300);
  };

  const hasMedia = post.media && post.media.length > 0;
  const isVideo = hasMedia && post.media![0].type === 'video';

  const handleMediaScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (SCREEN_WIDTH - 32));
    setActiveMediaIndex(index);
  };

  const handleVideoPress = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setVideoLoading(true);
      setTimeout(() => {
        setIsPlaying(true);
        setVideoLoading(false);
      }, 500);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      setBookmarksCount(prev => Math.max(0, prev - 1));
    } else {
      setIsBookmarked(true);
      setBookmarksCount(prev => prev + 1);
    }
  };

  // Profile bubbles for "Liked by"
  const renderLikedByAvatars = () => {
    // Generate simple mock avatar URLs for likedBy users
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'
    ];

    const displayAvatars = sampleAvatars.slice(0, Math.min(post.likesCount, 3));

    if (post.likesCount === 0) return null;

    return (
      <View style={styles.likedByContainer}>
        <View style={styles.avatarStack}>
          {displayAvatars.map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: url }}
              style={[
                styles.smallLikedAvatar,
                { marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }
              ]}
            />
          ))}
        </View>
        <Text style={styles.likedByText}>
          Liked by <Text style={styles.boldText}>{post.likedBy[0]?.username || 'miracle.h'}</Text>
          {post.likesCount > 1 && ` and ${post.likesCount - 1} other${post.likesCount > 2 ? 's' : ''}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.user.hasStatus ? (
            <View style={styles.headerAvatarRing}>
              <Image source={{ uri: post.user.avatar }} style={styles.avatarInRing} />
            </View>
          ) : (
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          )}
          <View style={styles.userMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <Text style={styles.userRole}> • {post.user.role}</Text>
            </View>
            <Text style={styles.postMetaText}>
              {post.type} • {post.createdAt}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.moreButton} 
          activeOpacity={0.6}
          onPress={() => setActionsVisible(true)}
        >
          <MoreHorizontal size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Body Text */}
      <Text style={styles.bodyText}>{post.body}</Text>

      {/* Location and Listing Type */}
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <MapPin size={16} color={Colors.textMuted} />
          <Text style={styles.locationText}>{post.location}</Text>
        </View>
        {post.listingType && (
          <View style={[
            styles.tag,
            post.listingType === 'For Rent' ? styles.tagRent : styles.tagSale
          ]}>
            <Tag size={12} color={post.listingType === 'For Rent' ? Colors.tagRentText : Colors.tagSaleText} />
            <Text style={[
              styles.tagText,
              post.listingType === 'For Rent' ? styles.tagRentText : styles.tagSaleText
            ]}>
              {post.listingType}
            </Text>
          </View>
        )}
      </View>

      {/* Media Carousel / Video */}
      {hasMedia && (
        <View style={styles.mediaContainer}>
          {isVideo ? (
            <TouchableOpacity 
              style={styles.videoWrapper} 
              activeOpacity={0.9} 
              onPress={handleVideoPress}
            >
              <Image
                source={{ uri: post.media![0].thumbnail || post.media![0].url }}
                style={styles.video}
                contentFit="cover"
              />
              <View style={styles.videoOverlay}>
                {videoLoading ? (
                  <View style={styles.playButtonCircle}>
                    <ActivityIndicator size="small" color="#FFF" />
                  </View>
                ) : !isPlaying ? (
                  <View style={styles.playButtonCircle}>
                    <Play size={24} color="#FFF" fill="#FFF" style={{ marginLeft: 3 }} />
                  </View>
                ) : (
                  <View style={styles.playButtonCircle}>
                    <View style={styles.pauseLinesContainer}>
                      <View style={styles.pauseLine} />
                      <View style={styles.pauseLine} />
                    </View>
                  </View>
                )}
                {post.media![0].duration && (
                  <View style={styles.durationPill}>
                    <Play size={10} color="#FFF" fill="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.durationText}>
                      {isPlaying ? 'Playing • 0:02 / ' : ''}{post.media![0].duration}
                    </Text>
                  </View>
                )}
                {isPlaying && (
                  <View style={styles.progressBarBg}>
                    <View style={styles.progressBarFill} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleMediaScroll}
                scrollEventThrottle={16}
                style={styles.imageScroll}
              >
                {post.media!.map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: item.url }}
                    style={styles.mediaImage}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>

              {/* Indicator dots for multiple images */}
              {post.media!.length > 1 && (
                <View style={styles.carouselIndicatorsContainer}>
                  <View style={styles.indicatorsRow}>
                    {post.media!.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicatorDot,
                          activeMediaIndex === index && styles.indicatorDotActive
                        ]}
                      />
                    ))}
                  </View>
                  
                  {/* Next Arrow Overlay */}
                  {activeMediaIndex < post.media!.length - 1 && (
                    <View style={styles.nextArrowContainer}>
                      <ChevronRight size={16} color="#FFF" />
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Actions Toolbar */}
      <View style={styles.actionsToolbar}>
        <View style={styles.leftActions}>
          {/* Like Button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.6}
            onPress={() => handleLike(post.id)}
          >
            <Heart 
              size={22} 
              color={post.likedByUser ? Colors.likeActive : Colors.text} 
              fill={post.likedByUser ? Colors.likeActive : 'transparent'} 
            />
            <Text style={[
              styles.actionCount,
              post.likedByUser && styles.activeActionText
            ]}>
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.6}
            onPress={() => onOpenComments(post.id)}
          >
            <MessageCircle size={22} color={Colors.text} />
            {post.commentsCount > 0 && (
              <Text style={styles.actionCount}>{post.commentsCount}</Text>
            )}
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
            <Send size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Bookmark Button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.6}
          onPress={toggleBookmark}
        >
          <Bookmark 
            size={22} 
            color={isBookmarked ? Colors.primary : Colors.text} 
            fill={isBookmarked ? Colors.primary : 'transparent'} 
          />
          {bookmarksCount > 0 && (
            <Text style={styles.actionCount}>{bookmarksCount}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Liked-by status text */}
      {renderLikedByAvatars()}

      {/* Three Dots Actions Modal */}
      {actionsVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={actionsVisible}
          onRequestClose={() => setActionsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop} 
              activeOpacity={1} 
              onPress={() => setActionsVisible(false)} 
            />
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>Options</Text>

              {/* Conditionally render Contact Agent */}
              {(post.user.role === 'Agent' || post.user.role === 'Broker' || post.user.role === 'Developer') && (
                <TouchableOpacity style={styles.modalItem} onPress={handleContactAgent}>
                  <View style={styles.modalItemLeft}>
                    <Phone size={18} color={Colors.text} />
                    <Text style={styles.modalItemText}>Contact Agent</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Conditionally render Request Inspection */}
              {post.type === 'Property' && (
                <TouchableOpacity style={styles.modalItem} onPress={handleRequestInspection}>
                  <View style={styles.modalItemLeft}>
                    <Calendar size={18} color={Colors.text} />
                    <Text style={styles.modalItemText}>Request Tour / Inspection</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Standard actions */}
              <TouchableOpacity style={styles.modalItem} onPress={handleCopyLink}>
                <View style={styles.modalItemLeft}>
                  <Copy size={18} color={Colors.text} />
                  <Text style={styles.modalItemText}>Copy Link</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalItem} onPress={handleShare}>
                <View style={styles.modalItemLeft}>
                  <Send size={18} color={Colors.text} />
                  <Text style={styles.modalItemText}>Share Post</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalItem} onPress={handleReport}>
                <View style={styles.modalItemLeft}>
                  <AlertTriangle size={18} color="#F59E0B" />
                  <Text style={[styles.modalItemText, { color: '#F59E0B' }]}>Report Post</Text>
                </View>
              </TouchableOpacity>

              {/* Conditionally render Delete Post */}
              {(post.userId === 'currentUser' || post.user.id === 'currentUser') && (
                <TouchableOpacity style={styles.modalItem} onPress={handleDeletePress}>
                  <View style={styles.modalItemLeft}>
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={[styles.modalItemText, { color: '#EF4444', fontWeight: 'bold' }]}>Delete Post</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setActionsVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
  },
  headerAvatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  avatarInRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  userMeta: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  userRole: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  postMetaText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  bodyText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagRent: {
    backgroundColor: Colors.tagRentBg,
  },
  tagRentText: {
    color: Colors.tagRentText,
    fontWeight: '600',
    fontSize: 12,
  },
  tagSale: {
    backgroundColor: Colors.tagSaleBg,
  },
  tagSaleText: {
    color: Colors.tagSaleText,
    fontWeight: '600',
    fontSize: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mediaContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: Colors.background,
  },
  imageScroll: {
    height: CARD_IMAGE_HEIGHT,
  },
  mediaImage: {
    width: SCREEN_WIDTH - 32, // 16 padding on each side
    height: CARD_IMAGE_HEIGHT,
  },
  carouselIndicatorsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorsRow: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorDotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextArrowContainer: {
    position: 'absolute',
    right: 12,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionsToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingBottom: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionCount: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  activeActionText: {
    color: Colors.likeActive,
  },
  likedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLikedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  likedByText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  boldText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  pauseLinesContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseLine: {
    width: 4,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBarFill: {
    height: '100%',
    width: '30%',
    backgroundColor: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  modalIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalItemText: {
    color: Colors.text,
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default React.memo(PostCard);
