import { useContext, type KeyboardEvent } from 'react';
import useLocalStorage from '@/hooks/UseLocalStorage';
import { useSearchParams } from 'react-router';
import { ThemeContext } from '@/store/ContextStore';

type Props = {
  onSearch: (term: string) => void;
};

export default function Search(prop: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchState, setSearchState] = useLocalStorage<string>(
    'searchState',
    ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    searchParams.set('page', String(1));
    setSearchParams(searchParams);
    setSearchState(searchState.trim());
    prop.onSearch(searchState.trim());
  };
  {
    return (
      <div className="flex justify-center  flex-col mb-8">
        <h1 className="text-center text-3xl mb-5">Pokewiki</h1>
        <div className="flex relative rounded-md w-full px-4 max-w-xl mx-auto">
          <button
            className="border-2 mr-9 p-3 rounded-md border-gray-300 dark:border-gray-100 dark:bg-black dark:text-white"
            onClick={toggleTheme}
          >
            {theme}
          </button>
          <input
            id="search"
            value={searchState}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-3 rounded-md border-2 border-r-white rounded-r-none border-gray-300 placeholder-gray-500 dark:text-white"
            type="text"
          />
          <button
            onClick={handleSearchClick}
            className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-r-md"
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    );
  }
}
