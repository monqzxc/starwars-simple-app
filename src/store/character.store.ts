import { create } from 'zustand';

import { fetchPeople, toApiError } from '@/services/swapi.service';
import type { Character } from '@/types/character.types';
import { readCachedCharacters, writeCachedCharacters } from '@/utils/storage';

interface CharacterState {
  characters: Character[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isOffline: boolean;
  lastFetched: number | null;
  hasLoadedCache: boolean;
  fetchCharacters: () => Promise<void>;
  refreshCharacters: () => Promise<void>;
  loadCachedCharacters: () => Promise<void>;
  clearError: () => void;
}

let inFlightRequest: Promise<void> | null = null;

export const useCharacterStore = create<CharacterState>()((set, get) => {
  const syncCharacters = (mode: 'loading' | 'refreshing'): Promise<void> => {
    if (inFlightRequest) return inFlightRequest;

    inFlightRequest = (async () => {
      set(mode === 'loading' ? { loading: true, error: null } : { refreshing: true, error: null });
      try {
        const fetched = await fetchPeople();
        if (fetched.length === 0 && get().characters.length > 0) {
          set({ isOffline: false });
          return;
        }
        const fetchedAt = Date.now();
        set({ characters: fetched, lastFetched: fetchedAt, isOffline: false });
        await writeCachedCharacters({ characters: fetched, fetchedAt });
      } catch (error) {
        const apiError = toApiError(error);
        set({
          error: apiError.message,
          isOffline: apiError.kind === 'network' || apiError.kind === 'timeout',
        });
      } finally {
        set({ loading: false, refreshing: false });
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
  };

  return {
    characters: [],
    loading: true,
    refreshing: false,
    error: null,
    isOffline: false,
    lastFetched: null,
    hasLoadedCache: false,

    fetchCharacters: () => syncCharacters('loading'),

    refreshCharacters: () => syncCharacters('refreshing'),

    loadCachedCharacters: async () => {
      const cached = await readCachedCharacters();
      if (cached && get().characters.length === 0) {
        set({ characters: cached.characters, lastFetched: cached.fetchedAt });
      }
      set({ hasLoadedCache: true });
    },

    clearError: () => set({ error: null }),
  };
});
