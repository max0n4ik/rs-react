import { API } from '../utils/constants';
import type {
  PokemonAPIResponse,
  PokemonDetails,
  SimplifiedPokemon,
} from './type';

export async function fetchPokemon(
  term: string
): Promise<Pick<SimplifiedPokemon, 'name' | 'image' | 'id'>[]> {
  const trimmed = term.trim().toLowerCase();

  if (trimmed === '') {
    const res = await fetch(`${API.API_URL}?limit=9`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data: PokemonAPIResponse = await res.json();

    const detailed = await Promise.all(
      data.results.map((p) => fetchPokemonDetails(p.url))
    );

    return detailed;
  } else {
    const res = await fetch(`${API.API_URL}/${trimmed}`);
    if (!res.ok) throw new Error(`Pokemon "${trimmed}" not found`);

    const data: PokemonDetails = await res.json();
    return [
      {
        name: data.name,
        image: data.sprites.front_default,
        id: data.id,
      },
    ];
  }
}

export async function fetchPokemonDetails(
  url: string
): Promise<SimplifiedPokemon> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  if (!speciesRes.ok) throw new Error(`Error: ${speciesRes.status}`);
  const speciesData = await speciesRes.json();

  let genderRatio = null;
  if (speciesData.gender_rate !== -1) {
    const female = (speciesData.gender_rate / 8) * 100;
    genderRatio = {
      male: 100 - female,
      female,
    };
  }

  const evYield: { [stat: string]: number } = {};
  for (const stat of data.stats) {
    if (stat.effort > 0) {
      evYield[stat.stat.name] = stat.effort;
    }
  }

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.front_default,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    abilities: data.abilities.map(
      (a: { ability: { name: string }; is_hidden: string }) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })
    ),
    genderRatio,
    catchRate: speciesData.capture_rate,
    eggGroups: speciesData.egg_groups.map((g: { name: string }) => g.name),
    hatchTime: speciesData.hatch_counter * 255,
    height: data.height / 10,
    weight: data.weight / 10,
    baseExp: data.base_experience,
    growthRate: speciesData.growth_rate.name,
    evYield,
    color: speciesData.color.name,
    shape: speciesData.shape.name,
    baseFriendship: speciesData.base_happiness,
    footprint: speciesData.has_footprint ? speciesData.id.toString() : null,
  };
}
