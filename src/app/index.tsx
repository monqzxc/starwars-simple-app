import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CHARACTER_CARD_HEIGHT, CharacterCard } from '@/components/CharacterCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Starfield } from '@/components/Starfield';
import { StatusBanner } from '@/components/StatusBanner';
import { colors } from '@/constants/theme';
import { useCharacterStore } from '@/store/character.store';
import type { Character } from '@/types/character.types';
import { formatTimestamp } from '@/utils/character';

const keyExtractor = (item: Character) => item.id;

const getItemLayout = (_: ArrayLike<Character> | null | undefined, index: number) => ({
  length: CHARACTER_CARD_HEIGHT,
  offset: CHARACTER_CARD_HEIGHT * index,
  index,
});

export default function CharacterListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { characters, loading, refreshing, error, isOffline, lastFetched, hasLoadedCache } =
    useCharacterStore(
      useShallow((state) => ({
        characters: state.characters,
        loading: state.loading,
        refreshing: state.refreshing,
        error: state.error,
        isOffline: state.isOffline,
        lastFetched: state.lastFetched,
        hasLoadedCache: state.hasLoadedCache,
      })),
    );
  const fetchCharacters = useCharacterStore((state) => state.fetchCharacters);
  const refreshCharacters = useCharacterStore((state) => state.refreshCharacters);
  const clearError = useCharacterStore((state) => state.clearError);

  const openCharacter = useCallback(
    (id: string) => router.push({ pathname: '/character/[id]', params: { id } }),
    [router],
  );

  const renderItem = useCallback<ListRenderItem<Character>>(
    ({ item }) => <CharacterCard character={item} onPress={openCharacter} />,
    [openCharacter],
  );

  const hasCharacters = characters.length > 0;
  const savedAt = lastFetched ? ` from ${formatTimestamp(lastFetched)}` : '';
  const bannerMessage = isOffline
    ? `You're offline. Showing saved characters${savedAt}.`
    : `Couldn't refresh. Showing saved characters${savedAt}.`;

  const renderEmpty = () => {
    if (!hasLoadedCache || loading) return <LoadingIndicator label="Loading characters…" />;
    if (error) {
      return (
        <ErrorMessage
          title={isOffline ? "You're offline" : "Couldn't load characters"}
          message={error}
          onAction={fetchCharacters}
        />
      );
    }
    return <EmptyState title="No characters found" message="Pull down to refresh." />;
  };

  return (
    <View style={styles.container}>
      <Starfield />
      {hasCharacters && error ? <StatusBanner message={bannerMessage} onDismiss={clearError} /> : null}
      <FlatList
        data={characters}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          { paddingBottom: insets.bottom },
          !hasCharacters && styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshCharacters}
            tintColor={colors.crawl}
            colors={[colors.crawl]}
            progressBackgroundColor={colors.surface}
          />
        }
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.space,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
