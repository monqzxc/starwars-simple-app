import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CHARACTER_CARD_HEIGHT, CharacterCard } from '@/components/CharacterCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FetchButton } from '@/components/FetchButton';
import { FetchingPill } from '@/components/FetchingPill';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Starfield } from '@/components/Starfield';
import { StatusBanner } from '@/components/StatusBanner';
import { Toast } from '@/components/Toast';
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
  const isBusy = loading || refreshing;
  const offlineMessage = lastFetched
    ? `You're offline. Showing saved data from ${formatTimestamp(lastFetched)}.`
    : "You're offline. Showing saved data.";

  const renderEmpty = () => {
    if (!hasLoadedCache || loading) return <LoadingIndicator label="Fetching data…" />;
    if (error) {
      return (
        <ErrorMessage
          title={isOffline ? "You're offline" : "Couldn't load characters"}
          message={error}
          onAction={fetchCharacters}
        />
      );
    }
    return <EmptyState title="No characters found" message="Tap Fetch data to try again." />;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerRight: () => <FetchButton disabled={isBusy} onPress={fetchCharacters} /> }}
      />
      <Starfield />
      {hasCharacters && isOffline ? <StatusBanner message={offlineMessage} /> : null}
      <View style={styles.body}>
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
        {hasCharacters && loading ? <FetchingPill /> : null}
      </View>
      <Toast title="Fetch failed" message={hasCharacters ? error : null} onHide={clearError} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.space,
  },
  body: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
