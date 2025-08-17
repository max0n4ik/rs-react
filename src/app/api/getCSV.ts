import { PokemonCard } from './type';

export default async function getCSV(data: Array<PokemonCard>) {
  const response = await fetch('/api/downloadCSV', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  const result = await response.blob();

  if (!response.ok) {
    console.error('Error downloading the file');
    return;
  }

  return result;
}
