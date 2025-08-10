import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '@/api/api';
import { API } from '@/utils/Constants';
import { transformToDetailedPokemon } from '@/utils/pokemonUtils';
import { createDetailedCSV } from '@/utils/DownloadCSV';
import type { FullPokemonDetails, PokemonSpecies } from '@/api/Type';

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

describe('transformToDetailedPokemon', () => {
  it('maps fields and computes derived values correctly', () => {
    const full: FullPokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'front.png' },
      types: [{ type: { name: 'electric' } }, { type: { name: 'steel' } }],
      abilities: [
        { ability: { name: 'static' }, is_hidden: false },
        { ability: { name: 'lightning-rod' }, is_hidden: true },
      ],
      height: 7,
      weight: 69,
      base_experience: 112,
      species: { url: 'url' },
      stats: [
        { stat: { name: 'speed' }, effort: 2 },
        { stat: { name: 'attack' }, effort: 0 },
      ],
    };

    const species: PokemonSpecies = {
      gender_rate: 4,
      capture_rate: 190,
      egg_groups: [{ name: 'field' }],
      hatch_counter: 10,
      growth_rate: { name: 'medium' },
      color: { name: 'yellow' },
      shape: { name: 'quadruped' },
      base_happiness: 70,
      has_footprint: true,
    };

    const detailed = transformToDetailedPokemon(full, species);

    expect(detailed).toMatchObject({
      id: 25,
      name: 'pikachu',
      image: 'front.png',
      types: ['electric', 'steel'],
      abilities: [
        { name: 'static', isHidden: false },
        { name: 'lightning-rod', isHidden: true },
      ],
      baseExp: 112,
      catchRate: 190,
      eggGroups: ['field'],
      growthRate: 'medium',
      color: 'yellow',
      shape: 'quadruped',
      baseFriendship: 70,
      footprint: '25',
    });
    expect(detailed.height).toBeCloseTo(0.7);
    expect(detailed.weight).toBeCloseTo(6.9);
    expect(detailed.genderRatio).toEqual({ male: 50, female: 50 });
    expect(detailed.evYield).toEqual({ speed: 2 });
  });
});

describe('createDetailedCSV', () => {
  it('produces a CSV with header and properly formatted row', () => {
    const detailed = {
      id: 25,
      name: 'pikachu',
      image: 'front.png',
      types: ['electric', 'steel'],
      abilities: [
        { name: 'static', isHidden: false },
        { name: 'lightning-rod', isHidden: true },
      ],
      genderRatio: { male: 50, female: 50 },
      catchRate: 190,
      eggGroups: ['field'],
      hatchTime: 2550,
      height: 0.7,
      weight: 6.9,
      baseExp: 112,
      growthRate: 'medium',
      evYield: { speed: 2 },
      color: 'yellow',
      shape: 'quadruped',
      baseFriendship: 70,
      footprint: '25',
    };

    const csv = createDetailedCSV([detailed]);

    expect(csv.split('\n')[0]).toBe(
      'id,name,image_url,types,abilities,gender_male,gender_female,catch_rate,egg_groups,hatch_time,height_m,weight_kg,base_exp,growth_rate,ev_yield,color,shape,base_friendship,footprint'
    );
    expect(csv).toContain('25');
    expect(csv).toContain('"pikachu"');
    expect(csv).toContain('front.png');
    expect(csv).toContain('"electric;steel"');
    expect(csv).toContain('"static;lightning-rod (hidden)"');
    expect(csv).toContain(',50,50,');
    expect(csv).toContain('190');
    expect(csv).toContain('"field"');
    expect(csv).toContain('0.7');
    expect(csv).toContain('6.9');
    expect(csv).toContain('112');
    expect(csv).toContain('medium');
    expect(csv).toContain('"speed:2"');
    expect(csv).toContain('yellow');
    expect(csv).toContain('quadruped');
    expect(csv).toContain('70');
    expect(csv).toContain('25');
  });
});
