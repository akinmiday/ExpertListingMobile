import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Colors } from '../theme/colors';

export default function PostCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.titleBar} />
          <View style={styles.subtitleBar} />
        </View>
      </View>

      {/* Body Lines */}
      <View style={styles.body}>
        <View style={styles.bodyLine} />
        <View style={styles.bodyLineShort} />
      </View>

      {/* Media Box */}
      <View style={styles.media} />

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.actionIcon} />
        <View style={styles.actionIcon} />
        <View style={styles.actionIcon} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  titleBar: {
    width: '50%',
    height: 14,
    borderRadius: 4,
    backgroundColor: Colors.inputBg,
  },
  subtitleBar: {
    width: '30%',
    height: 10,
    borderRadius: 4,
    backgroundColor: Colors.inputBg,
  },
  body: {
    gap: 8,
    marginVertical: 4,
  },
  bodyLine: {
    width: '100%',
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.inputBg,
  },
  bodyLineShort: {
    width: '70%',
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.inputBg,
  },
  media: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.inputBg,
  },
});
