import type {
  DetailedPokemon,
  FullPokemonDetails,
  PokemonSpecies,
  GenderRatio,
  EvYield,
  PokemonStat,
} from '@/app/api/type';

export const calculateGenderRatio = (genderRate: number): GenderRatio | null => {
  if (genderRate === -1) return null;
  const female = (genderRate / 8) * 100;
  return {
    male: 100 - female,
    female,
  };
};

export const calculateEvYield = (stats: PokemonStat[]): EvYield => {
  const evYield: EvYield = {};
  for (const stat of stats) {
    if (stat.effort > 0) {
      evYield[stat.stat.name] = stat.effort;
    }
  }
  return evYield;
};

export const transformToDetailedPokemon = (
  pokemonData: FullPokemonDetails,
  speciesData: PokemonSpecies
): DetailedPokemon => {
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image: pokemonData.sprites.front_default,
    types: pokemonData.types.map((t) => t.type.name),
    abilities: pokemonData.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    height: pokemonData.height / 10,
    weight: pokemonData.weight / 10,
    baseExp: pokemonData.base_experience,
    genderRatio: calculateGenderRatio(speciesData.gender_rate),
    catchRate: speciesData.capture_rate,
    eggGroups: speciesData.egg_groups.map((g) => g.name),
    hatchTime: speciesData.hatch_counter * 255,
    growthRate: speciesData.growth_rate.name,
    evYield: calculateEvYield(pokemonData.stats),
    color: speciesData.color.name,
    shape: speciesData.shape.name,
    baseFriendship: speciesData.base_happiness,
    footprint: speciesData.has_footprint ? pokemonData.id.toString() : null,
  };
};
