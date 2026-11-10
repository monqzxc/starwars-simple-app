import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

export function FetchingPill() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.pill} accessibilityRole="progressbar" accessibilityLabel="Fetching data">
        <ActivityIndicator size="small" color={colors.crawl} />
        <Text style={styles.label}>Fetching data…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  label: {
    color: colors.star,
    fontSize: 14,
  },
});
