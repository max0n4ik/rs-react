import { fetchPokemon } from '../api/api';
import { API } from '../utils/constants';
import type { PokemonAPIResponse, PokemonDetails } from '../api/type';

global.fetch = vi.fn();

const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

describe('fetchPokemon', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches default list (limit=9) when term is empty', async () => {
    const mockListResponse: PokemonAPIResponse = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
        },
      ],
    };

    const mockDetailsResponse = (name: string): PokemonDetails => ({
      name,
      height: 4,
      weight: 60,
      sprites: { front_default: `${name}.png` },
      types: [{ type: { name: 'electric' } }],
    });

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockListResponse })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetailsResponse('pikachu'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetailsResponse('bulbasaur'),
      });

    const result = await fetchPokemon('');

    expect(fetch).toHaveBeenCalledWith(`${API.API_URL}?limit=9`);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('pikachu');
  });

  it('fetches specific pokemon by name', async () => {
    const name = 'charizard';
    const details: PokemonDetails = {
      name,
      height: 10,
      weight: 200,
      sprites: { front_default: 'charizard.png' },
      types: [{ type: { name: 'fire' } }],
    };

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => details });

    const result = await fetchPokemon('  Charizard  ');

    expect(fetch).toHaveBeenCalledWith(`${API.API_URL}/charizard`);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'charizard',
      image: 'charizard.png',
      description: 'Type: fire, Height: 10, Weight: 200',
    });
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

  it('throws error if details fetch fails (inside list)', async () => {
    const mockListResponse: PokemonAPIResponse = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
      ],
    };

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockListResponse })
      .mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(fetchPokemon('')).rejects.toThrow('Error: 404');
  });
});
