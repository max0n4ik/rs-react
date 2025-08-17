'use client';

import { ChangeEvent, startTransition, useContext, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/store/ContextStore';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useRootDispatch } from '@/store/store';
import { setSearchTerm } from '@/store/SearchSlice';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale, useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

export default function Search() {
  const dispatch = useRootDispatch();
  const router = useRouter();
  const t = useTranslations('Search');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
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
  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  const handleResetCache = () => {
    router.replace('/');
    setSearchState('');
    dispatch(setSearchTerm(''));
    localStorage.removeItem('searchState');
  };

  {
    return (
      <div className="flex justify-center  flex-col mb-8">
        <h1 className="text-center text-3xl mb-5">Pokewiki</h1>
        <div className="flex relative rounded-md w-full px-4 max-w-3xl mx-auto">
          <select
            onChange={onSelectChange}
            defaultValue={locale}
            className="border-2 mr-9 p-3 rounded-md border-gray-300 dark:border-gray-100 dark:bg-black dark:text-white">
            {routing.locales.map((cur) => (
              <option key={cur} value={cur}>
                {t('locale', { locale: cur })}
              </option>
            ))}
          </select>
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
