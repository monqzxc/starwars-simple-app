import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailRow } from '@/components/DetailRow';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { colors, spacing } from '@/constants/theme';
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
    title: character?.name ?? '',
    headerLeft: canGoBack
      ? undefined
      : () => (
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={goBack} hitSlop={12}>
            <Text style={styles.headerBack}>‹ Back</Text>
          </Pressable>
        ),
  };

  if (!validId) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <ErrorMessage
          title="Invalid character"
          message="This character ID is not valid."
          actionLabel="Back to characters"
          onAction={goBack}
        />
      </>
    );
  }

  if (!character) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        {isLoading ? (
          <LoadingIndicator label="Loading character…" />
        ) : (
          <ErrorMessage
            title="Character not found"
            message="We couldn't find this character. Try refreshing the list."
            actionLabel="Back to characters"
            onAction={goBack}
          />
        )}
      </>
    );
  }

  const filmCount = character.films.length;

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={styles.hero}>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.subtitle}>
            {filmCount} {filmCount === 1 ? 'film appearance' : 'film appearances'}
          </Text>
        </View>
        <DetailRow label="Height" value={formatMeasurement(character.height, 'cm')} />
        <DetailRow label="Mass" value={formatMeasurement(character.mass, 'kg')} />
        <DetailRow label="Gender" value={formatText(character.gender)} />
        <DetailRow label="Birth year" value={formatText(character.birth_year)} />
        <DetailRow label="Hair color" value={formatText(character.hair_color)} />
        <DetailRow label="Skin color" value={formatText(character.skin_color)} />
        <DetailRow label="Eye color" value={formatText(character.eye_color)} />
        <DetailRow label="Films" value={String(filmCount)} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  hero: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  name: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  headerBack: {
    color: colors.accent,
    fontSize: 17,
  },
});
