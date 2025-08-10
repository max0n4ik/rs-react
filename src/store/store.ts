import { configureStore } from '@reduxjs/toolkit';
import cardReducer from '@/store/CardSlice.ts';
import searchReducer from '@/store/SearchSlice';
import { pokemonApi } from '@/api/api';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    card: cardReducer,
    search: searchReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useRootSelector = useSelector.withTypes<RootState>();
export const useRootDispatch = useDispatch.withTypes<AppDispatch>();
