import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { X, Send } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Comment } from '../api/client';
import { useApp } from '../context/AppContext';

interface CommentsModalProps {
  postId: string | null;
  visible: boolean;
  onClose: () => void;
}

export default function CommentsModal({ postId, visible, onClose }: CommentsModalProps) {
  const { handleLoadComments, handleAddComment } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && postId) {
      loadComments();
    } else {
      setComments([]);
    }
  }, [visible, postId]);

  const loadComments = async () => {
    if (!postId) return;
    setLoading(true);
    const fetched = await handleLoadComments(postId);
    setComments(fetched);
    setLoading(false);
  };

  const submitComment = async () => {
    if (!postId || !commentText.trim()) return;
    const addedComment = await handleAddComment(postId, commentText);
    if (addedComment) {
      setComments(prev => [...prev, addedComment]);
      setCommentText('');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        {/* Click outside to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.modalContent}>
          {/* Header Indicator Bar */}
          <View style={styles.indicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comments ({comments.length})</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentTextContainer}>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentUserName}>{item.user.name}</Text>
                      <Text style={styles.commentRole}> • {item.user.role}</Text>
                      <Text style={styles.commentTime}> • {item.createdAt}</Text>
                    </View>
                    <Text style={styles.commentBody}>{item.body}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
                </View>
              }
            />
          )}

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]} 
              onPress={submitComment}
              disabled={!commentText.trim()}
            >
              <Send size={18} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '65%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 8,
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
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  commentTextContainer: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  commentUserName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  commentRole: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  commentTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  commentBody: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.modalBg,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: Colors.text,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
});
