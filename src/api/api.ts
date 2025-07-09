import { API } from '../utils/constants';
import type { ApiResponse } from './type';

export async function fetchPokemon(search: string): Promise<ApiResponse> {
  const cleanSearch = search.trim();
  const url = cleanSearch
    ? `${API.API_URL}/pokemon/${cleanSearch}`
    : API.API_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
