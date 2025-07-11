import { API } from '../utils/constants';
import type {
  PokemonAPIResponse,
  PokemonDetails,
  SimplifiedPokemon,
} from './type';

export async function fetchPokemon(term: string): Promise<SimplifiedPokemon[]> {
  const trimmed = term.trim().toLowerCase();

  if (trimmed === '') {
    // Загружаем первые 20 покемонов
    const res = await fetch(`${API.API_URL}?limit=20`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data: PokemonAPIResponse = await res.json();

    const detailed = await Promise.all(
      data.results.map((p) => fetchPokemonDetails(p.url))
    );

    return detailed;
  } else {
    // Поиск по имени
    const res = await fetch(`${API.API_URL}/${trimmed}`);
    if (!res.ok) throw new Error(`Pokemon "${trimmed}" not found`);

    const data: PokemonDetails = await res.json();
    return [
      {
        name: data.name,
        description: `Type: ${data.types.map((t) => t.type.name).join(', ')}, Height: ${data.height}, Weight: ${data.weight}`,
      },
    ];
  }
}

async function fetchPokemonDetails(url: string): Promise<SimplifiedPokemon> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  const data: PokemonDetails = await res.json();

  return {
    name: data.name,
    description: `Type: ${data.types.map((t) => t.type.name).join(', ')}, Height: ${data.height}, Weight: ${data.weight}`,
  };
}
