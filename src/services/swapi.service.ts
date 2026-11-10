import type { ApiErrorKind, Character } from '@/types/character.types';
import { normalizeCharacter } from '@/utils/character';

const PEOPLE_URL = 'https://swapi.info/api/people';
const REQUEST_TIMEOUT_MS = 15000;

const ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'No internet connection. Check your network and try again.',
  timeout: 'The request timed out. Please try again.',
  http: 'The Star Wars API is unavailable right now.',
  invalid: 'Received an unexpected response from the Star Wars API.',
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string = ERROR_MESSAGES[kind]) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof Error && error.name === 'AbortError') return new ApiError('timeout');
  return new ApiError('network');
}

export function parseCharacters(data: unknown): Character[] {
  if (!Array.isArray(data)) throw new ApiError('invalid');
  const characters = data
    .map(normalizeCharacter)
    .filter((character): character is Character => character !== null);
  if (data.length > 0 && characters.length === 0) throw new ApiError('invalid');
  return characters;
}

export async function fetchPeople(): Promise<Character[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(PEOPLE_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError('http', `${ERROR_MESSAGES.http} (HTTP ${response.status})`);
    }
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new ApiError('invalid');
    }
    return parseCharacters(data);
  } catch (error) {
    throw toApiError(error);
  } finally {
    clearTimeout(timeout);
  }
}
