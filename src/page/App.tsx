import Search from '@/components/Search';
import CardList from '@/components/CardList';
import { Link, Outlet } from 'react-router';

import Flyout from '@/components/Flyout';
import { clearCards } from '@/store/CardSlice';
import { useRootDispatch, useRootSelector } from '@/store/store';

export function App() {
  const dispatch = useRootDispatch();

  const selectedPokemons = useRootSelector((state) => state.card.selectedPokemons);

  return (
    <div className="flex gap-10 items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="">
        <Search />

        <CardList />
        <div className="flex justify-end mr-5 ">
          <Link
            className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
            to="about">
            About
          </Link>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
      {selectedPokemons.length != 0 && (
        <Flyout
          selectedCount={selectedPokemons.length}
          onUnselectAll={() => {
            dispatch(clearCards());
          }}
        />
      )}
    </div>
  );
}
