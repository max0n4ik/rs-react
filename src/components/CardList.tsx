'use client';

import Card from '@/components/Card';
import Pagination from '@/components/Pagination';
import { useGetPokemonsQuery } from '@/app/api/api';
import { useRootSelector } from '@/store/store';
import { useCallback, useState } from 'react';
import { ITEMS_PER_PAGE } from '@/utils/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Loading from './Loading';

export default function CardList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const offset = Math.max(0, (page - 1) * ITEMS_PER_PAGE);
  const searchTerm = useRootSelector((state) => state.search.searchTerm);
  const { data, isLoading, error } = useGetPokemonsQuery(searchTerm, offset);
  const createQueryString = useCallback(
    (value: number) => {
      const next = Math.max(1, value);
      setPage(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(next));

      return params.toString();
    },
    [searchParams]
  );

  const changePage = (value: number) => {
    router.push(pathname + '?' + createQueryString(value));
  };

  if (data?.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Not found</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-red-600">
        <h2 className="text-xl font-bold mb-2">Error: {`${'data' in error ? error.data : (error ?? '')}`}</h2>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      {!error && (
        <div className="grid grid-cols gap-4 my-4 justify-center">
          {data?.map((item, index) => (
            <Card key={index} id={item.id} name={item.name} image={item.image ?? ''} isLoading={isLoading} />
          ))}
        </div>
      )}
      <Pagination currentPage={Math.max(1, page)} onChange={changePage} />
    </>
  );
}
