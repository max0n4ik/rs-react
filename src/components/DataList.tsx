import type { CountryData, Data, NewColons } from '../types/data-type';
import CountryItem from './CountryItem';
import clsx from 'clsx';

type Props = {
  data: Data;
  newColons: NewColons;
  onSort: (column: keyof CountryData) => void;
};

function DataList({ data, newColons, onSort }: Props) {
  const columnCount = 6 + Object.values(newColons).filter(Boolean).length;
  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-lg text-[#efeae4] shadow-lg">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold">Country Data</h2>
      </div>

      <div className="max-h-[720px] overflow-y-auto">
        <div
          className={clsx(
            'grid border-b border-[#3c493b] px-6 py-4 font-bold text-[#efeae4] transition-colors duration-200 hover:bg-[#2b3a2c]',
            `grid-cols-${columnCount}`
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

          <div onClick={() => onSort('population')} className="col-span-1 flex cursor-pointer place-content-center">
            <span>Population</span>
          </div>

          <div onClick={() => onSort('co2')} className="col-span-1 flex cursor-pointer place-content-center">
            <span className="text-[#efeae4]">CO2</span>
          </div>

          <div onClick={() => onSort('co2_per_capita')} className="col-span-1 flex cursor-pointer place-content-center">
            <span className="text-[#efeae4]">Per capita CO2</span>
          </div>
          {newColons.oil_co2 && (
            <div onClick={() => onSort('oil_co2')} className="col-span-1 flex cursor-pointer place-content-center">
              <span className="text-[#efeae4]">Oil</span>
            </div>
          )}

          {newColons.methane && (
            <div onClick={() => onSort('methane')} className="col-span-1 flex cursor-pointer place-content-center">
              <span className="text-[#efeae4]">Methane</span>
            </div>
          )}
        </div>
        {Object.entries(data).map(([code]) => (
          <CountryItem key={data[code].iso_code} data={data[code]} country={code} newColons={newColons} />
        ))}
      </div>
    </div>
  );
}

export default DataList;
