import { fetchPokemon } from '@/api/Api';
import { API } from '@/utils/Constants';
import type { NamedAPIResourceList } from '@/api/Type';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockPokemonListResponse: NamedAPIResourceList = {
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
  ],
  count: 1,
  next: null,
  previous: null,
};

const mockPokemonDetails = (name: string) => ({
  id: name === 'pikachu' ? 25 : 1,
  name,
  sprites: { front_default: `${name}.png` },
  species: {
    name: name,
    url: `https://pokeapi.co/api/v2/pokemon-species/${name}/`,
  },
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  abilities: [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
  ],
  base_experience: 112,
  height: 4,
  weight: 60,
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 2, stat: { name: 'attack', url: '' } },
  ],
});

const mockSpeciesDetails = (name: string) => ({
  gender_rate: 4,
  capture_rate: 45,
  egg_groups: [{ name: 'monster', url: '' }],
  hatch_counter: 20,
  growth_rate: { name: 'medium-slow', url: '' },
  color: { name: 'yellow', url: '' },
  shape: { name: 'quadruped', url: '' },
  base_happiness: 70,
  has_footprint: true,
  id: name === 'pikachu' ? 25 : 1,
  name,
  url: `https://pokeapi.co/api/v2/pokemon-species/${name}/`,
});

describe('fetchPokemon', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches default list (limit=9) when term is empty', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails('pikachu'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesDetails('pikachu'),
      });

    const result = await fetchPokemon('');

    expect(mockFetch).toHaveBeenCalledWith(`${API.API_URL}?limit=50`);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon-species/pikachu/'
    );

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('pikachu');
    expect(result[0].id).toBe(25);
    expect(result[0].image).toBe('pikachu.png');
  });

  it('fetches specific pokemon by name', async () => {
    const searchTerm = 'charizard';
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(fetchPokemon(searchTerm)).rejects.toThrow(
      `Pokemon "${searchTerm}" not found`
    );
    expect(mockFetch).toHaveBeenCalledWith(`${API.API_URL}/${searchTerm}`);
  });

  it('throws error if list fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchPokemon('')).rejects.toThrow('Error: 500');
  });

  it('throws error if pokemon not found', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchPokemon('unknownmon')).rejects.toThrow(
      'Pokemon "unknownmon" not found'
    );
    expect(fetch).toHaveBeenCalledWith(`${API.API_URL}/unknownmon`);
  });

  it('throws an error when fetching default list fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchPokemon('')).rejects.toThrow('Error: 500');
    expect(mockFetch).toHaveBeenCalledWith(`${API.API_URL}?limit=50`);
  });
});
