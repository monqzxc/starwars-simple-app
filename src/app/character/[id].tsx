import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailRow } from '@/components/DetailRow';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FilmBars } from '@/components/FilmBars';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Starfield } from '@/components/Starfield';
import { colors, spacing, TOTAL_FILMS } from '@/constants/theme';
import { useCharacterStore } from '@/store/character.store';
import { formatMeasurement, formatText, isValidCharacterId } from '@/utils/character';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const validId = isValidCharacterId(id);
  const character = useCharacterStore((state) =>
    validId ? state.characters.find((item) => item.id === id) : undefined,
  );
  const isLoading = useCharacterStore(
    (state) => !state.hasLoadedCache || (state.loading && state.characters.length === 0),
  );

  const canGoBack = router.canGoBack();
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  const screenOptions = {
    title: '',
    headerLeft: canGoBack
      ? undefined
      : () => (
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={goBack} hitSlop={12}>
            <Text style={styles.headerBack}>‹ Back</Text>
          </Pressable>
        ),
  };

  if (!validId || !character) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={screenOptions} />
        <Starfield />
        {validId && isLoading ? (
          <LoadingIndicator label="Loading character…" />
        ) : (
          <ErrorMessage
            title={validId ? 'Character not found' : 'Invalid character'}
            message={validId ? 'Refresh the list and try again.' : 'This link has an invalid character ID.'}
            actionLabel="Back to characters"
            onAction={goBack}
          />
        )}
      </View>
    );
  }

  const filmCount = character.films.length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={screenOptions} />
      <Starfield />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={styles.name} accessibilityRole="header">
          {character.name}
        </Text>
        <View style={styles.films}>
          <FilmBars count={filmCount} size="large" />
          <Text style={styles.filmsLabel}>
            {filmCount} of {TOTAL_FILMS} films
          </Text>
        </View>
        <View style={styles.stats}>
          <DetailRow label="Height" value={formatMeasurement(character.height, 'cm')} />
          <DetailRow label="Mass" value={formatMeasurement(character.mass, 'kg')} />
          <DetailRow label="Gender" value={formatText(character.gender)} />
          <DetailRow label="Birth year" value={formatText(character.birth_year)} />
          <DetailRow label="Hair color" value={formatText(character.hair_color)} />
          <DetailRow label="Skin color" value={formatText(character.skin_color)} />
          <DetailRow label="Eye color" value={formatText(character.eye_color)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.space,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  name: {
    color: colors.crawl,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  films: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  filmsLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  stats: {
    marginTop: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  headerBack: {
    color: colors.crawl,
    fontSize: 17,
  },
});
