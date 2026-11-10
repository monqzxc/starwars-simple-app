import type { Character } from '@/types/character.types';

const ID_PATTERN = /\/people\/(\d+)\/?$/;
const UNKNOWN_VALUES = new Set(['', 'unknown', 'none']);

export function extractCharacterId(url: string): string | null {
  const match = ID_PATTERN.exec(url);
  return match ? match[1] : null;
}

export function isValidCharacterId(id: unknown): id is string {
  return typeof id === 'string' && /^\d+$/.test(id);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value.trim() : 'unknown';
}

export function normalizeCharacter(value: unknown): Character | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  const name = readString(record, 'name');
  const url = readString(record, 'url');
  const id = extractCharacterId(url);
  if (!id || UNKNOWN_VALUES.has(name.toLowerCase())) return null;

  const films = Array.isArray(record.films)
    ? record.films.filter((film): film is string => typeof film === 'string')
    : [];

  return {
    id,
    name,
    url,
    films,
    height: readString(record, 'height'),
    mass: readString(record, 'mass'),
    hair_color: readString(record, 'hair_color'),
    skin_color: readString(record, 'skin_color'),
    eye_color: readString(record, 'eye_color'),
    birth_year: readString(record, 'birth_year'),
    gender: readString(record, 'gender'),
  };
}

export function formatText(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (UNKNOWN_VALUES.has(normalized)) return 'Unknown';
  if (normalized === 'n/a') return 'N/A';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatMeasurement(value: string, unit: string): string {
  const numeric = value.replace(/,/g, '');
  return /^\d+(\.\d+)?$/.test(numeric) ? `${value} ${unit}` : formatText(value);
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
