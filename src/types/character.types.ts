export interface ApiCharacter {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  films: string[];
  url: string;
}

export interface Character extends ApiCharacter {
  id: string;
}

export interface CachedCharacters {
  characters: Character[];
  fetchedAt: number;
}

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'invalid';
