import { fetchPokemonsData } from '@/app/api/api';
import type { PokemonCard } from '@/app/api/type';
import App from '@/components/App';

export default async function Page() {
  const data: PokemonCard[] = await fetchPokemonsData('', 1);
  return <App initialCards={data} />;
}
