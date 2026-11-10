import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

interface ToastProps {
  title: string;
  message: string | null;
  onHide: () => void;
  duration?: number;
}

export function Toast({ title, message, onHide, duration = 4000 }: ToastProps) {
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(({ finished }) => {
        if (finished) onHide();
      });
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onHide, opacity]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + spacing.lg, opacity }]}
    >
      <Pressable
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityHint="Tap to dismiss"
        onPress={onHide}
        style={styles.toast}
      >
        <View style={styles.marker} />
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 20,
  },
  toast: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  marker: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.danger,
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  title: {
    color: colors.star,
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});
