import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

interface StatusBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function StatusBanner({ message, onDismiss }: StatusBannerProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.dot} />
      <Text style={styles.message}>{message}</Text>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={12} onPress={onDismiss}>
          <Text style={styles.dismiss}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.crawl,
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
  },
  dismiss: {
    color: colors.textMuted,
    fontSize: 14,
    marginLeft: spacing.sm,
  },
});
