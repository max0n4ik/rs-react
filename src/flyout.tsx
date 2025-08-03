import { useEffect, useRef, useState } from 'react';
import { downloadCSV } from './utils/csv-downloader';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

type FlyoutProps = {
  selectedCount: number;
  onUnselectAll: () => void;
};

export default function Flyout({ selectedCount, onUnselectAll }: FlyoutProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const selectedPokemons = useSelector(
    (state: RootState) => state.card.selectedPokemons
  );

  useEffect(() => {
    let url: string;

    const prepareCSV = async () => {
      if (selectedPokemons.length === 0) return;

      const csvContent = await downloadCSV(selectedPokemons);
      if (!csvContent) return;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setFilename(`${selectedPokemons.length}_items.csv`);
    };

    prepareCSV();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [selectedPokemons]);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex items-center justify-between border dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </p>
      <div className="flex gap-3">
        <button
          onClick={onUnselectAll}
          className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Unselect all
        </button>
        <a
          ref={linkRef}
          href={downloadUrl ?? ''}
          download={filename || 'data.csv'}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Download
        </a>
      </div>
    </div>
  );
}
