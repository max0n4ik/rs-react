import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: localStorage.getItem('searchState') || '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
