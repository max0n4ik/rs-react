export type PokemonAPIResponse = {
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonDetails = {
  name: string;
  weight: number;
  height: number;
  types: { type: { name: string } }[];
};

export type SimplifiedPokemon = {
  name: string;
  description: string;
};
