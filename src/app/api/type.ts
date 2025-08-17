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

export type PokemonSprites = {
  front_default: string;
};

export type PokemonStat = {
  stat: { name: string };
  effort: number;
};

export type PokemonTypeEntry = {
  type: { name: string };
};

export type PokemonAbilityEntry = {
  ability: { name: string };
  is_hidden: boolean;
};

export type SimplifiedPokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type GenderRatio = {
  male: number;
  female: number;
};

export type EvYield = {
  [stat: string]: number;
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: PokemonSprites;
};

export type FullPokemonDetails = PokemonDetails & {
  species: { url: string };
  stats: PokemonStat[];
  types: PokemonTypeEntry[];
  abilities: PokemonAbilityEntry[];
  height: number;
  weight: number;
  base_experience: number;
};

export type PokemonSpecies = {
  gender_rate: number;
  capture_rate: number;
  egg_groups: { name: string }[];
  hatch_counter: number;
  growth_rate: { name: string };
  color: { name: string };
  shape: { name: string };
  base_happiness: number;
  has_footprint: boolean;
};

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
}

export type PokemonCard = {
  id: number;
  name: string;
  image: string;
};

export interface DetailedPokemon {
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
