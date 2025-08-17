'use client';
import { useRef } from 'react';
import { useRootSelector } from '@/store/store';

import { useTranslations } from 'next-intl';
import getCSV from '@/app/api/getCSV';

type FlyoutProps = {
  selectedCount: number;
  onUnselectAll: () => void;
};

export default function Flyout({ selectedCount, onUnselectAll }: FlyoutProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const t = useTranslations('Flyout');
  const selectedPokemons = useRootSelector((state) => state.card.selectedPokemons);

  const handleDownload = async () => {
    const file = await getCSV(selectedPokemons);
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.download = `${selectedPokemons.length}_items.csv`;
      linkRef.current.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex items-center justify-between border dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {selectedCount} {t('item')}
        {selectedCount > 1 ? 's' : ''} {t('selected')}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onUnselectAll}
          className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
          {t('unselect')}
        </button>

        <button
          onClick={handleDownload}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {t('download')}
        </button>
        <a download={`${selectedPokemons.length}_items.csv`} ref={linkRef} href=""></a>
      </div>
    </div>
  );
}
