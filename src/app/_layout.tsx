import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import { useCharacterStore } from '@/store/character.store';

export default function RootLayout() {
  useEffect(() => {
    const { loadCachedCharacters, fetchCharacters } = useCharacterStore.getState();
    loadCachedCharacters().then(fetchCharacters);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.space },
          headerTintColor: colors.crawl,
          headerTitleStyle: { color: colors.star, fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.space },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Star Wars Characters' }} />
        <Stack.Screen name="character/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}
