import { type ChangeEvent, type KeyboardEvent } from 'react';
import useLocalStorage from './hooks/useLocalStorage';

type Props = {
  onSearch: (term: string) => void;
};

export default function Search(prop: Props) {
  const [searchState, setSearchState] = useLocalStorage<string>(
    'searchState',
    ''
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchState(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    searchState.trim();
    prop.onSearch(searchState);
  };
  {
    return (
      <div className="flex justify-center mt-6 flex-col mb-3">
        <h1 className="text-center text-3xl mb-5">Pokewiki</h1>
        <div className="flex relative rounded-md w-full px-4 max-w-xl mx-auto">
          <input
            id="search"
            value={searchState}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border-2 border-r-white rounded-r-none border-gray-300 placeholder-gray-500"
            type="text"
          />
          <button
            onClick={handleSearchClick}
            className="inline-flex items-center gap-2 bg-violet-700 text-white text-lg font-semibold py-3 px-6 rounded-r-md"
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    );
  }
}
