import { createDetailedCSV } from '@/utils/DownloadCSV';
import { NextRequest, NextResponse } from 'next/server';
import { PokemonCard } from '../type';
import { fetchDetailedPokemon } from '../api';

export async function POST(req: NextRequest) {
  try {
    const { data } = (await req.json()) as { data: PokemonCard[] };

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const detailedList = [];

    for (const card of data) {
      try {
        const detailedPokemon = await fetchDetailedPokemon(`${card.id}`);
        detailedList.push(detailedPokemon);
      } catch (err) {
        console.warn(`Error fetching Pokemon ${card}:`, err);
      }
    }
    const csvContent = createDetailedCSV(detailedList);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="pokemons.csv"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}
