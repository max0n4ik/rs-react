import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API, ITEMS_PER_PAGE } from '@/utils/constants';
import type {
  DetailedPokemon,
  FullPokemonDetails,
  NamedAPIResourceList,
  Pokemon,
  PokemonCard,
  PokemonSpecies,
} from './type';
import { createDetailedCSV } from '@/utils/DownloadCSV';
import { transformToDetailedPokemon } from '@/utils/pokemonUtils';

const fetchDetailedPokemon = async (pokemonId: number | string): Promise<DetailedPokemon> => {
  const pokemonData = await fetchPokemonData(pokemonId);
  const speciesData = await fetchSpeciesData(pokemonData.species.url);
  return transformToDetailedPokemon(pokemonData, speciesData);
};

const fetchPokemonData = async (pokemonId: number | string): Promise<FullPokemonDetails> => {
  const pokemonResponse = await fetch(`${API.API_URL}/${pokemonId}`, { cache: 'force-cache' });
  if (!pokemonResponse.ok) {
    throw new Error(`Failed to fetch Pokemon ${pokemonId}: ${pokemonResponse.status}`);
  }
  return pokemonResponse.json();
};

const fetchSpeciesData = async (speciesUrl: string): Promise<PokemonSpecies> => {
  const speciesResponse = await fetch(speciesUrl, { cache: 'force-cache' });
  if (!speciesResponse.ok) {
    throw new Error(`Failed to fetch species data: ${speciesResponse.status}`);
  }
  return speciesResponse.json();
};

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: API.API_URL }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemon: builder.query<
      PokemonCard[] | (Pick<NamedAPIResourceList, 'next' | 'previous'> & PokemonCard[]),
      { name: string; offset: number }
    >({
      query: ({ name, offset = 1 }) => `${name}?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      transformResponse: (response: NamedAPIResourceList | Pokemon) => {
        if ('name' in response) {
          return [
            {
              id: response.id,
              name: response.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${response.id}.png`,
            },
          ];
        }
        const pokemonCards: PokemonCard[] = response.results.map((item) => {
          const id = parseInt(item.url.split('/').filter(Boolean).pop() || '0', 10);
          return {
            id,
            name: item.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });
        return Object.assign(pokemonCards, {
          next: response.next,
          previous: response.previous,
        });
      },
      providesTags: ['Pokemon'],
    }),
    getPokemonDetails: builder.query<DetailedPokemon, string>({
      async queryFn(url) {
        try {
          const pokemonId = url.split('/').filter(Boolean).pop() || '';

          const detailedPokemon = await fetchDetailedPokemon(pokemonId);
          return { data: detailedPokemon };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return {
            error: { status: 'CUSTOM_ERROR', error: errorMessage },
          };
        }
      },
    }),
    generateCSVDownload: builder.query<string, PokemonCard[]>({
      async queryFn(pokemonCards) {
        try {
          const detailedList: DetailedPokemon[] = [];

          for (const card of pokemonCards) {
            try {
              const detailedPokemon = await fetchDetailedPokemon(card.id);
              detailedList.push(detailedPokemon);
            } catch (err) {
              console.warn(`Error processing Pokemon ${card.id}:`, err);
            }
          }

          const csvContent = createDetailedCSV(detailedList);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const downloadUrl = URL.createObjectURL(blob);

          return { data: downloadUrl };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return {
            error: { status: 'CUSTOM_ERROR', error: errorMessage },
          };
        }
      },
    }),
  }),
});

export const { useGetPokemonQuery, useGetPokemonDetailsQuery, useGenerateCSVDownloadQuery } = pokemonApi;
