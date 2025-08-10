import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API, ITEMS_PER_PAGE } from '@/utils/Constants';
import type { NamedAPIResourceList, Pokemon, PokemonCard } from './Type';

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
  }),
});

export const { useGetPokemonQuery } = pokemonApi;
