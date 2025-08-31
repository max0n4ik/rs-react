import { memo, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import type { CountryData, CountryInfo, NewColumns } from '../types/data-type';
import { formatNumber, formatDecimal, formatYear } from '../utils/formatters';
import clsx from 'clsx';
import Cell from './Cell';

type Props = {
  data?: CountryInfo;
  country: string;
  newColumns: NewColumns;
};

function CountryItem({ data, country, newColumns }: Props): JSX.Element {
  const columnCount = useMemo(() => 6 + Object.values(newColumns).filter(Boolean).length, [newColumns]);
  const gridColsClass = columnCount === 6 ? 'grid-cols-6' : columnCount === 7 ? 'grid-cols-7' : 'grid-cols-8';

  const [highlighted, setHighlighted] = useState<Record<string, number>>({});

  const prevDataRef = useRef<CountryData | null>(null);
  const timersRef = useRef<number[]>([]);
  const currentData = data?.data?.[0] ?? null;

  const dataToDisplay = useMemo(
    () =>
      currentData
        ? {
            year: formatYear(currentData.year),
            population: formatNumber(currentData.population),
            co2: formatDecimal(currentData.co2),
            co2_per_capita: formatDecimal(currentData.co2_per_capita),
            methane: formatDecimal(currentData.methane),
            oil_co2: formatDecimal(currentData.oil_co2),
          }
        : {
            year: 'N/A',
            population: 'N/A',
            co2: 'N/A',
            co2_per_capita: 'N/A',
            oil_co2: 'N/A',
            methane: 'N/A',
          },
    [currentData]
  );

  useEffect(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];

    if (!currentData) {
      prevDataRef.current = currentData;
      return;
    }

    if (!prevDataRef.current) {
      prevDataRef.current = currentData;
      return;
    }

    const keys: (keyof CountryData)[] = [
      'year',
      'population',
      'co2',
      'co2_per_capita',
      ...(newColumns.oil_co2 ? ['oil_co2' as keyof CountryData] : []),
      ...(newColumns.methane ? ['methane' as keyof CountryData] : []),
    ];

    const prev = prevDataRef.current;
    const changed: string[] = [];

    for (const key of keys) {
      const prevVal = prev[key];
      const newVal = currentData[key];

      if (prevVal !== newVal) {
        changed.push(key);
      }
    }

    if (changed.length > 0) {
      const now = Date.now();

      setHighlighted((prevState) => {
        const next = { ...prevState };
        changed.forEach((key) => {
          next[key] = now;
        });
        return next;
      });

      changed.forEach((key) => {
        const ts = now;
        const id = window.setTimeout(() => {
          setHighlighted((cur) => {
            if (cur[key] !== ts) return cur;
            const { [key]: _, ...rest } = cur;
            return rest;
          });
        }, 1000);
        timersRef.current.push(id);
      });
    }

    prevDataRef.current = currentData;
  }, [currentData, newColumns.methane, newColumns.oil_co2]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  return (
    <div
      className={clsx(
        `grid border-b border-[#3c493b] px-6 py-4 text-[#efeae4]`,
        gridColsClass,
        `transition-colors duration-200 hover:bg-[#2b3a2c]`
      )}>
      <div className="col-span-1 flex items-center self-start">
        <span>{data?.iso_code || 'N/A'}</span>
      </div>

      <div className="col-span-1 flex">
        <span className="text-sm font-medium">{country || 'N/A'}</span>
      </div>

      <Cell key="year" highlighted={!!highlighted.year}>
        {dataToDisplay.year}
      </Cell>

      <Cell key="population" highlighted={!!highlighted.population}>
        {dataToDisplay.population}
      </Cell>

      <Cell key="co2" highlighted={!!highlighted.co2}>
        {dataToDisplay.co2}
      </Cell>

      <Cell key="co2_per_capita" highlighted={!!highlighted.co2_per_capita}>
        {dataToDisplay.co2_per_capita}
      </Cell>

      {newColumns.oil_co2 && (
        <Cell key="oil_co2" highlighted={!!highlighted.oil_co2}>
          {dataToDisplay.oil_co2}
        </Cell>
      )}

      {newColumns.methane && (
        <Cell key="methane" highlighted={!!highlighted.methane}>
          {dataToDisplay.methane}
        </Cell>
      )}
    </div>
  );
}

export default memo(CountryItem);
