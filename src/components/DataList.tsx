import { memo, useCallback, useMemo } from 'react';
import type { CountryData, Data, NewColumns } from '../types/data-type';
import CountryItem from './CountryItem';
import clsx from 'clsx';

type Props = {
  data: Data;
  newColumns: NewColumns;
  onSort: (column: keyof CountryData) => void;
};

function DataList({ data, newColumns, onSort }: Props) {
  const columnCount = useMemo(() => 6 + Object.values(newColumns).filter(Boolean).length, [newColumns]);
  const gridColsClass = columnCount === 6 ? 'grid-cols-6' : columnCount === 7 ? 'grid-cols-7' : 'grid-cols-8';

  const handleSortPopulation = useCallback(() => onSort('population'), [onSort]);
  const handleSortCo2 = useCallback(() => onSort('co2'), [onSort]);
  const handleSortCo2PerCapita = useCallback(() => onSort('co2_per_capita'), [onSort]);
  const handleSortOil = useCallback(() => onSort('oil_co2'), [onSort]);
  const handleSortMethane = useCallback(() => onSort('methane'), [onSort]);

  const items = useMemo(() => Object.entries(data) as [string, { iso_code: string; data: CountryData[] }][], [data]);
  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-lg text-[#efeae4] shadow-lg">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold">Country Data</h2>
      </div>

      <div className="max-h-[720px] overflow-y-auto">
        <div
          className={clsx(
            'grid border-b border-[#3c493b] px-6 py-4 font-bold text-[#efeae4] transition-colors duration-200 hover:bg-[#2b3a2c]',
            gridColsClass
          )}>
          <div className="col-span-1 flex self-start">
            <span className="rounded">ISO</span>
          </div>

          <div className="col-span-1 flex">
            <span>Country</span>
          </div>

          <div className="col-span-1 flex place-content-center">
            <span>Year</span>
          </div>

          <div onClick={handleSortPopulation} className="col-span-1 flex cursor-pointer place-content-center">
            <span>Population</span>
          </div>

          <div onClick={handleSortCo2} className="col-span-1 flex cursor-pointer place-content-center">
            <span className="text-[#efeae4]">CO2</span>
          </div>

          <div onClick={handleSortCo2PerCapita} className="col-span-1 flex cursor-pointer place-content-center">
            <span className="text-[#efeae4]">Per capita CO2</span>
          </div>
          {newColumns.oil_co2 && (
            <div onClick={handleSortOil} className="col-span-1 flex cursor-pointer place-content-center">
              <span className="text-[#efeae4]">Oil</span>
            </div>
          )}

          {newColumns.methane && (
            <div onClick={handleSortMethane} className="col-span-1 flex cursor-pointer place-content-center">
              <span className="text-[#efeae4]">Methane</span>
            </div>
          )}
        </div>
        {items.map(([code]) => (
          <CountryItem key={data[code].iso_code} data={data[code]} country={code} newColumns={newColumns} />
        ))}
      </div>
    </div>
  );
}

export default memo(DataList);
