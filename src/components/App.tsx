'use client';

import Search from '@/components/Search';
import CardList from '@/components/CardList';

import Flyout from '@/components/Flyout';
import { clearCards } from '@/store/CardSlice';
import { useRootDispatch, useRootSelector } from '@/store/store';
import DetailCard from '@/components/DetailCard';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { PokemonCard } from '@/app/api/type';
import { useGetPokemonsQuery } from '@/app/api/api';

export default function App({ initialCards }: { initialCards: PokemonCard[] }) {
  const searchParams = useSearchParams();
  const detailId = searchParams.get('detail');
  const page = searchParams.get('page');
  const dispatch = useRootDispatch();
  const selectedPokemons = useRootSelector((state) => state.card.selectedPokemons);
  const t = useTranslations('HomePage');
  useGetPokemonsQuery('', Number(page ?? 1), initialCards);

  return (
    <>
      <div>
        <Search />
        <CardList />
        <div className="flex justify-end mr-5 ">
          <Link
            className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
            href="/about">
            {t('about')}
          </Link>
        </div>
      </div>
      {detailId && <DetailCard />}
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
