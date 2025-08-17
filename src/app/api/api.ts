import { useQuery } from '@tanstack/react-query';
import { API, ITEMS_PER_PAGE } from '@/utils/constants';
import type { DetailedPokemon, NamedAPIResourceList, Pokemon, PokemonCard, PokemonSpecies } from './type';
import { transformToDetailedPokemon } from '@/utils/pokemonUtils';

export const fetchPokemonCard = async (name: number | string): Promise<PokemonCard[]> => {
  const res = await fetch(`${API.API_URL}/${name}`, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to fetch Pokemon list: ${res.status}`);
  const response = await res.json();

  return [
    {
      id: response.id,
      name: response.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${response.id}.png`,
    },
  ];
};

export const fetchPokemonData = async (name: number | string): Promise<Pokemon> => {
  const res = await fetch(`${API.API_URL}/${name}`, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to fetch Pokemon list: ${res.status}`);
  return await res.json();
};

export const fetchPokemonsData = async (
  name: string,
  offset: number
): Promise<(PokemonCard[] & { next: string | null; previous: string | null }) | PokemonCard[]> => {
  if (name != '') {
    return fetchPokemonCard(name);
  }
  const res = await fetch(`${API.API_URL}/${name}?limit=${ITEMS_PER_PAGE}&offset=${offset}`);

  const response = await res.json();

  const list = response as NamedAPIResourceList;
  const pokemonCards: PokemonCard[] = list.results.map((item) => {
    const id = parseInt(item.url.split('/').filter(Boolean).pop() || '0', 10);
    return {
      id,
      name: item.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  });

  return Object.assign(pokemonCards, {
    next: list.next,
    previous: list.previous,
  });
};

const fetchSpeciesData = async (speciesUrl: string): Promise<PokemonSpecies> => {
  const res = await fetch(speciesUrl, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to fetch species data: ${res.status}`);
  }
  return res.json();
};

export const fetchDetailedPokemon = async (pokemonId: number | string): Promise<DetailedPokemon> => {
  const pokemonData = await fetchPokemonData(pokemonId);
  const speciesData = await fetchSpeciesData(pokemonData.species.url);
  return transformToDetailedPokemon(pokemonData, speciesData);
};

export const useGetPokemonsQuery = (name: string, offset: number, initialData?: PokemonCard[]) => {
  return useQuery({
    queryKey: ['pokemon', name, offset],
    queryFn: () => fetchPokemonsData(name, offset),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: false,
    initialData: name === '' && offset === 1 ? initialData : undefined,
  });
};

export const useGetPokemonDetailsQuery = (url: string) => {
  return useQuery({
    queryKey: ['pokemonDetails', url],
    queryFn: async () => {
      const pokemonId = url.split('/').filter(Boolean).pop() || '';
      return fetchDetailedPokemon(pokemonId);
    },
  });
};
