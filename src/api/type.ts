export type NamedAPIResourceList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: { front_default: string };
};

export type DataPokemon = {
  data: SimplifiedPokemon[];
};

export interface SimplifiedPokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: {
    name: string;
    isHidden: boolean;
  }[];
  genderRatio: {
    male: number;
    female: number;
  } | null;
  catchRate: number;
  eggGroups: string[];
  hatchTime: number;
  height: number;
  weight: number;
  baseExp: number;
  growthRate: string;
  evYield: {
    [stat: string]: number;
  };
  color: string;
  shape: string;
  baseFriendship: number;
  footprint: string | null;
}
