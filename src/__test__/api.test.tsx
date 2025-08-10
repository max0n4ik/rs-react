import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '@/api/api';
import { API } from '@/utils/Constants';

const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>();
globalThis.fetch = fetchMock as unknown as typeof fetch;

function jsonResponse<T>(data: T, status = 200, ok = true): Response {
  return { ok, status, json: async () => data } as unknown as Response;
}

const createStore = () =>
  configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (gdm) => gdm().concat(pokemonApi.middleware),
  });

describe('pokemonApi.getPokemon', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('returns error when list fetch fails', async () => {
    const store = createStore();
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'fail' }, 500, false));

    const args = { name: '', offset: 0 };
    const action = pokemonApi.endpoints.getPokemon.initiate(args);
    await store.dispatch(action);

    const state = store.getState();
    const { error } = pokemonApi.endpoints.getPokemon.select(args)(state);

    expect(error).toBeDefined();
  });
});

describe('pokemonApi.getPokemonDetails', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('returns error when details fetch fails', async () => {
    const store = createStore();
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'fail' }, 404, false));

    const url = `${API.API_URL}/99999`;
    const action = pokemonApi.endpoints.getPokemonDetails.initiate(url);
    await store.dispatch(action);

    const state = store.getState();
    const { data, error } = pokemonApi.endpoints.getPokemonDetails.select(url)(state);
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });
});
