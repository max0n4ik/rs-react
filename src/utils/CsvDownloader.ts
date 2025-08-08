import type { SimplifiedPokemon } from '@/api/Type';
import { fetchPokemonDetails } from '@/api/Api';

type CardProps = {
  id: number;
  name: string;
  image?: string;
};

const createDetailedCSV = (pokemonList: SimplifiedPokemon[]): string => {
  const header = [
    'id',
    'name',
    'image_url',
    'types',
    'abilities',
    'gender_male',
    'gender_female',
    'catch_rate',
    'egg_groups',
    'hatch_time',
    'height_m',
    'weight_kg',
    'base_exp',
    'growth_rate',
    'ev_yield',
    'color',
    'shape',
    'base_friendship',
    'footprint',
  ].join(',');

  const rows = pokemonList.map((p) => {
    const abilities = p.abilities
      .map((a) => `${a.name}${a.isHidden ? ' (hidden)' : ''}`)
      .join(';');
    const types = p.types.join(';');
    const eggGroups = p.eggGroups.join(';');
    const evYield = Object.entries(p.evYield)
      .map(([stat, val]) => `${stat}:${val}`)
      .join(';');

    return [
      p.id,
      `"${p.name}"`,
      p.image,
      `"${types}"`,
      `"${abilities}"`,
      p.genderRatio?.male ?? '',
      p.genderRatio?.female ?? '',
      p.catchRate,
      `"${eggGroups}"`,
      p.hatchTime,
      p.height,
      p.weight,
      p.baseExp,
      p.growthRate,
      `"${evYield}"`,
      p.color,
      p.shape,
      p.baseFriendship,
      p.footprint ?? '',
    ].join(',');
  });

  return `${header}\n${rows.join('\n')}`;
};

export const downloadCSV = async (cards: CardProps[]) => {
  if (cards.length === 0) return;

  const detailedList: SimplifiedPokemon[] = [];

  for (const card of cards) {
    const url = `https://pokeapi.co/api/v2/pokemon/${card.id}`;
    try {
      const details = await fetchPokemonDetails(url);
      detailedList.push(details);
    } catch (err) {
      console.warn(`invalid id: id=${card.id}:`, err);
    }
  }

  const csvContent = createDetailedCSV(detailedList);

  return csvContent;
};
