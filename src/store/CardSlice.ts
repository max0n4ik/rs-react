import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Props = {
  id: number;
  name: string;
  image?: string;
};

type PokemonsState = {
  selectedPokemons: Props[];
};

const initialState: PokemonsState = {
  selectedPokemons: [],
};
type AddPokemonPayload = {
  pokemon: Props;
};
type RemovePokemonPayload = {
  id: number;
};
export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<AddPokemonPayload>) => {
      const { pokemon } = action.payload;
      const isExist = state.selectedPokemons.some((p) => p.id === pokemon.id);
      if (!isExist) {
        state.selectedPokemons.push(pokemon);
      }
    },
    removeCard: (state, action: PayloadAction<RemovePokemonPayload>) => {
      const { id } = action.payload;
      state.selectedPokemons = state.selectedPokemons.filter((pokemon) => pokemon.id !== id);
    },
    clearCards: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { addCard, removeCard, clearCards } = cardSlice.actions;

export default cardSlice.reducer;
