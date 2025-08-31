import { Suspense, use, useCallback, useMemo, useState } from 'react';
import DataList from './components/DataList';
import { DataPromise } from './api/api';
import type { CountryData, Filters } from './types/data-type';
import { FilterSection } from './components/FilterSection';
import Loading from './components/Loading';
import { processFilters } from './utils/filters';

function App() {
  const data = use(DataPromise);
  const [filters, setFilters] = useState<Filters>({
    country: '',
    year: 2023,
    sort: { column: null, order: 'asc' },
    newColumns: { oil_co2: false, methane: false },
  });
  const handleSort = useCallback((column: keyof CountryData) => {
    setFilters((prev) => ({
      ...prev,
      sort: {
        column,
        order: prev.sort.column === column && prev.sort.order === 'asc' ? 'desc' : 'asc',
      },
    }));
  }, []);

  const filteredData = useMemo(() => processFilters(data, filters), [data, filters]);

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-[#1c2b1f] font-[Montserrat]">
        <div className="w-full place-content-center p-4 text-center">
          <FilterSection filters={filters} onChange={setFilters} />
          <Suspense fallback={<Loading />}>
            <DataList data={filteredData} newColumns={filters.newColumns} onSort={handleSort} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default App;
