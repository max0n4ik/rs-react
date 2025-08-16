'use client';

import { useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/store/ContextStore';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useRootDispatch } from '@/store/store';
import { setSearchTerm } from '@/store/SearchSlice';
import { pokemonApi } from '@/api/api';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Search() {
  const dispatch = useRootDispatch();
  const router = useRouter();
  const t = useTranslations('Search');
  const [searchState, setSearchState] = useLocalStorage<string>('searchState', '');
  const searchParams = useSearchParams();
  const detailId = searchParams.get('detail');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const prevPath = `?page=1` + (detailId ? `&detail=${detailId}` : '');
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
    router.replace(prevPath);
    setSearchState(searchState.trim());
    dispatch(setSearchTerm(searchState.trim()));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResetCache = () => {
    router.replace('/');
    setSearchState('');
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
            {t(`${theme}`)}
          </button>
          <button
            className="border-2 mr-9 p-3 rounded-md border-gray-300 dark:border-gray-100 dark:bg-black dark:text-white"
            onClick={handleResetCache}>
            {t('reset')}
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
            <span>{t('search')}</span>
          </button>
        </div>
      </div>
    );
  }
}
