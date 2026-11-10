import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

interface StatusBannerProps {
  message: string;
}

export function StatusBanner({ message }: StatusBannerProps) {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLiveRegion="polite">
      <View style={styles.dot} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
});
