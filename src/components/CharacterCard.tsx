import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FilmBars } from '@/components/FilmBars';
import { colors, spacing } from '@/constants/theme';
import type { Character } from '@/types/character.types';

export const CHARACTER_CARD_HEIGHT = 68;

interface CharacterCardProps {
  character: Character;
  onPress: (id: string) => void;
}

function CharacterCardComponent({ character, onPress }: CharacterCardProps) {
  const filmCount = character.films.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${filmCount} ${filmCount === 1 ? 'film' : 'films'}`}
      onPress={() => onPress(character.id)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.name} numberOfLines={1}>
        {character.name}
      </Text>
      <FilmBars count={filmCount} />
    </Pressable>
  );
}

export const CharacterCard = memo(CharacterCardComponent);

const styles = StyleSheet.create({
  row: {
    height: CHARACTER_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  name: {
    flex: 1,
    color: colors.star,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginRight: spacing.md,
  },
});
