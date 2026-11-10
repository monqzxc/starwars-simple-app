import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CachedCharacters, Character } from '@/types/character.types';
import { normalizeCharacter } from '@/utils/character';

const CHARACTERS_KEY = '@starwars-explorer/characters/v1';

export async function readCachedCharacters(): Promise<CachedCharacters | null> {
  try {
    const raw = await AsyncStorage.getItem(CHARACTERS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { characters, fetchedAt } = parsed as Record<string, unknown>;
    if (!Array.isArray(characters) || typeof fetchedAt !== 'number') return null;
    const valid = characters
      .map(normalizeCharacter)
      .filter((character): character is Character => character !== null);
    return valid.length > 0 ? { characters: valid, fetchedAt } : null;
  } catch {
    return null;
  }
}

export async function writeCachedCharacters(data: CachedCharacters): Promise<boolean> {
  if (data.characters.length === 0) return false;
  try {
    await AsyncStorage.setItem(CHARACTERS_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
