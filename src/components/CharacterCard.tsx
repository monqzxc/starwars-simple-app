import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import type { Character } from '@/types/character.types';
import { formatText } from '@/utils/character';

export const CHARACTER_CARD_HEIGHT = 72;

interface CharacterCardProps {
  character: Character;
  onPress: (id: string) => void;
}

function indicatorColor(gender: string): string {
  const value = gender.toLowerCase();
  if (value === 'male') return colors.male;
  if (value === 'female') return colors.female;
  return colors.neutral;
}

function CharacterCardComponent({ character, onPress }: CharacterCardProps) {
  const tint = indicatorColor(character.gender);
  const filmCount = character.films.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${character.name}`}
      onPress={() => onPress(character.id)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.indicator, { borderColor: tint }]}>
        <Text style={[styles.initial, { color: tint }]}>{character.name.charAt(0)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatText(character.birth_year)} · {filmCount} {filmCount === 1 ? 'film' : 'films'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export const CharacterCard = memo(CharacterCardComponent);

const styles = StyleSheet.create({
  row: {
    height: CHARACTER_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  initial: {
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    marginLeft: spacing.sm,
  },
});
