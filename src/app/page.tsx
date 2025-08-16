'use client';

import Search from '@/components/Search';
import CardList from '@/components/CardList';
import Link from 'next/link';

import Flyout from '@/components/Flyout';
import { clearCards } from '@/store/CardSlice';
import { useRootDispatch, useRootSelector } from '@/store/store';

export default function App() {
  const dispatch = useRootDispatch();
  const selectedPokemons = useRootSelector((state) => state.card.selectedPokemons);

  return (
    <>
      <div className="">
        <Search />

        <CardList />
        <div className="flex justify-end mr-5 ">
          <Link
            className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
            href="about">
            About
          </Link>
        </div>
      </div>

      {selectedPokemons.length != 0 && (
        <Flyout
          selectedCount={selectedPokemons.length}
          onUnselectAll={() => {
            dispatch(clearCards());
          }}
        />
      )}
    </>
  );
}
