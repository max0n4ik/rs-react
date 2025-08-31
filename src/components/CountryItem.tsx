import { useEffect, useRef, useState, type JSX } from 'react';
import type { CountryData, CountryInfo, NewColons } from '../types/data-type';
import { formatNumber, formatDecimal, formatYear } from '../utils/formatters';
import clsx from 'clsx';
import { Cell } from './Cell';

type Props = {
  data?: CountryInfo;
  country: string;
  newColons: NewColons;
};

function CountryItem({ data, country, newColons }: Props): JSX.Element {
  const columnCount = 6 + Object.values(newColons).filter(Boolean).length;

  const [highlighted, setHighlighted] = useState<Record<string, number>>({});

  const prevDataRef = useRef<CountryData | null>(null);

  const currentData = data?.data?.[0] ?? null;

  const dataToDisplay = currentData
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
      };

  useEffect(() => {
    const keys: (keyof CountryData)[] = [
      'year',
      'population',
      'co2',
      'co2_per_capita',
      ...(newColons.oil_co2 ? ['oil_co2' as keyof CountryData] : []),
      ...(newColons.methane ? ['methane' as keyof CountryData] : []),
    ];

    const prev = prevDataRef.current;

    if (currentData) {
      const changed: string[] = [];

      for (const key of keys) {
        const prevVal = prev?.[key];
        const newVal = currentData[key];
        if (prev && prevVal !== newVal) {
          changed.push(key);
        }
        if (!prev && newVal != null) {
          changed.push(key);
        }
      }

      if (changed.length) {
        setHighlighted((prevState) => {
          const next = { ...prevState };
          for (const key of changed) {
            next[key] = Date.now();
          }
          return next;
        });

        for (const key of changed) {
          setTimeout(() => {
            setHighlighted((cur) => {
              const { [key]: _, ...copy } = cur;
              return copy;
            });
          }, 1000);
        }
      }
    }

    prevDataRef.current = currentData;
  }, [currentData, newColons.methane, newColons.oil_co2]);

  return (
    <div
      className={clsx(
        `grid border-b border-[#3c493b] px-6 py-4 text-[#efeae4]`,
        `grid-cols-${columnCount}`,
        `transition-colors duration-200 hover:bg-[#2b3a2c]`
      )}>
      <div className="col-span-1 flex items-center self-start">
        <span>{data?.iso_code || 'N/A'}</span>
      </div>

      <div className="col-span-1 flex">
        <span className="text-sm font-medium">{country || 'N/A'}</span>
      </div>

      <Cell highlighted={!!highlighted.year}>{dataToDisplay.year}</Cell>

      <Cell highlighted={!!highlighted.population}>{dataToDisplay.population}</Cell>

      <Cell highlighted={!!highlighted.co2}>{dataToDisplay.co2}</Cell>

      <Cell highlighted={!!highlighted.co2_per_capita}>{dataToDisplay.co2_per_capita}</Cell>

      {newColons.oil_co2 && <Cell highlighted={!!highlighted.oil_co2}>{dataToDisplay.oil_co2}</Cell>}

      {newColons.methane && <Cell highlighted={!!highlighted.methane}>{dataToDisplay.methane}</Cell>}
    </div>
  );
}

export default CountryItem;
