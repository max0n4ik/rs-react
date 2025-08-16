'use client';

import { useContext, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/store/ContextStore';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useRootDispatch } from '@/store/store';
import { setSearchTerm } from '@/store/SearchSlice';
import { pokemonApi } from '@/api/api';

export default function Search() {
  const dispatch = useRootDispatch();
  const [searchState, setSearchState] = useLocalStorage<string>('searchState', '');
  // const searchParams = useSearchParams();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('searchState');
    if (savedSearchTerm) {
      dispatch(setSearchTerm(savedSearchTerm));
    }
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState(e.target.value);
  };

  const handleSearch = () => {
    // searchParams.set('page', String(1));
    // setSearchParams(searchParams);
    setSearchState(searchState.trim());
    dispatch(setSearchTerm(searchState.trim()));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResetCache = () => {
    setSearchState('');
    // searchParams.delete('page');
    // setSearchParams(searchParams);
    dispatch(setSearchTerm(''));
    localStorage.removeItem('searchState');

    dispatch(pokemonApi.util.resetApiState());
  };

  {
    return (
      <div className="flex justify-center  flex-col mb-8">
        <h1 className="text-center text-3xl mb-5">Pokewiki</h1>
        <div className="flex relative rounded-md w-full px-4 max-w-3xl mx-auto">
          <button
            className="border-2 mr-9 p-3 rounded-md border-gray-300 dark:border-gray-100 dark:bg-black dark:text-white"
            onClick={toggleTheme}>
            {theme}
          </button>
          <button
            className="border-2 mr-9 p-3 rounded-md border-gray-300 dark:border-gray-100 dark:bg-black dark:text-white"
            onClick={handleResetCache}>
            Reset Cache
          </button>
          <input
            id="search"
            value={searchState}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full max-w-xl p-3 rounded-md border-2 border-r-white rounded-r-none border-gray-300 placeholder-gray-500 dark:text-white"
            type="text"
          />
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-r-md">
            <span>Search</span>
          </button>
        </div>
      </div>
    );
  }
}
