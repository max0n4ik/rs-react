'use client';

import { addCard, removeCard } from '@/store/CardSlice';
import { useRootDispatch, useRootSelector } from '@/store/store';

import type { PokemonCard } from '@/app/api/type';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import Loading from './Loading';

type CardProps = PokemonCard & { isLoading?: boolean };

export default function Card({ id, name, image, isLoading }: CardProps) {
  const dispatch = useRootDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPokemons = useRootSelector((state) => state.card.selectedPokemons);
  const isSelected = selectedPokemons.some((p: { id: number }) => p.id === id);
  const handleCheckboxChange = () => {
    if (isSelected) {
      dispatch(removeCard({ id: id }));
    } else {
      dispatch(addCard({ pokemon: { id, name, image } }));
    }
  };

  const handleClick = () => {
    if (searchParams) {
      const pageNumber = searchParams.get('page') || '1';
      router.push(`/?page=${pageNumber}&detail=${id}`);
    }
  };

  return (
    <button className="cursor-pointer" onClick={handleClick}>
      <div className="border p-4 rounded shadow bg-white dark:bg-black hover:shadow-md dark:border-white transition flex flex-col relative">
        <input
          className="size-4 self-end z-10"
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange();
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {isLoading && <Loading />}

        <Image
          width={116}
          height={116}
          src={image}
          alt={name}
          className="render-pixel size-29 self-center transition-opacity duration-300"
        />

        <h2 className="text-lg font-semibold capitalize text-center dark:text-white">{name}</h2>
      </div>
    </button>
  );
}
