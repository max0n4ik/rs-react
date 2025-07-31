type FlyoutProps = {
  selectedCount: number;
  onDownload: () => void;
  onUnselectAll: () => void;
};

export default function Flyout({
  selectedCount,
  onDownload,
  onUnselectAll,
}: FlyoutProps) {
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
        <button
          onClick={onDownload}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Download
        </button>
      </div>
    </div>
  );
}
