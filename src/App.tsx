import { Suspense, use, useState } from 'react';
import DataList from './components/DataList';
import { DataPromise } from './api/api';
import type { CountryData, CountryInfo, Filters } from './types/data-type';
import { FilterSection } from './components/FilterSection';
import Loading from './components/Loading';

function App() {
  const data = use(DataPromise);
  const [filters, setFilters] = useState<Filters>({
    country: '',
    year: 2023,
    sort: { column: null, order: 'asc' },
    newColons: { oil_co2: false, methane: false },
  });
  const handleSort = (column: keyof CountryData) => {
    setFilters((prev) => ({
      ...prev,
      sort: {
        column,
        order: prev.sort.column === column && prev.sort.order === 'asc' ? 'desc' : 'asc',
      },
    }));
  };

  const processFilters = (data: Record<string, CountryInfo>, filters: Filters) => {
    let result = Object.entries(data);

    if (filters.country) {
      const searchTerm = filters.country.toLowerCase();
      result = result.filter(([country]) => country.toLowerCase().includes(searchTerm));
    }

    const processed = result
      .map(([country, info]) => {
        const dataPoint = filters.year !== null ? info.data.find((d) => d.year === filters.year) : info.data.at(-1);

        return dataPoint ? { country, info, dataPoint } : null;
      })
      .filter((item): item is { country: string; info: CountryInfo; dataPoint: CountryData } => item !== null);

    if (filters.sort.column && filters.sort.column !== null) {
      processed.sort((a, b) => {
        const column = filters.sort.column as keyof CountryData;
        const valA = a.dataPoint?.[column];
        const valB = b.dataPoint?.[column];

        if (valA === undefined && valB === undefined) return 0;
        if (valA === undefined) return filters.sort.order === 'asc' ? 1 : -1;
        if (valB === undefined) return filters.sort.order === 'asc' ? -1 : 1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return filters.sort.order === 'asc' ? valA - valB : valB - valA;
        }
        return filters.sort.order === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return Object.fromEntries(
      processed.map(({ country, info, dataPoint }) => [country, { ...info, data: [dataPoint] }])
    );
  };
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-[#1c2b1f] font-[Montserrat]">
        <div className="w-full place-content-center p-4 text-center">
          <FilterSection filters={filters} onChange={setFilters} />
          <Suspense fallback={<Loading />}>
            <DataList data={processFilters(data, filters)} newColons={filters.newColons} onSort={handleSort} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default App;
