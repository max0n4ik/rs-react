'use client';
import { configureStore } from '@reduxjs/toolkit';
import cardReducer from '@/store/CardSlice';
import searchReducer from '@/store/SearchSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    card: cardReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useRootSelector = useSelector.withTypes<RootState>();
export const useRootDispatch = useDispatch.withTypes<AppDispatch>();
