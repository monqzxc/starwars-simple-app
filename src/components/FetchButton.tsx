import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '@/constants/theme';

interface FetchButtonProps {
  disabled: boolean;
  onPress: () => void;
}

export function FetchButton({ disabled, onPress }: FetchButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}
    >
      <Text style={styles.label}>Fetch data</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.crawl,
  },
  dimmed: {
    opacity: 0.4,
  },
  label: {
    color: colors.crawl,
    fontSize: 14,
    fontWeight: '600',
  },
});
