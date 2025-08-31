import type { Filters } from '../types/data-type';

export default function Modal({
  onClose,
  filters,
  onChange,
}: {
  onClose: () => void;
  filters: Filters;
  onChange: (value: Filters) => void;
}) {
  return (
    <div className="absolute inset-0 top-1/10 flex max-h-44 max-w-[300px] flex-col place-content-center items-center gap-1.5 rounded-2xl bg-[#3c493b] p-3">
      <div className="text-white">Select Colons</div>
      <button
        onClick={() => {
          onChange({
            ...filters,
            newColons: {
              ...filters.newColons,
              methane: !filters.newColons.methane,
            },
          });
        }}
        className="rounded-lg bg-[#4dae50e6] px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600">
        {filters.newColons.methane ? 'Remove Methane colons' : 'Add Methane colons'}
      </button>
      <button
        onClick={() => {
          onChange({
            ...filters,
            newColons: {
              ...filters.newColons,
              oil_co2: !filters.newColons.oil_co2,
            },
          });
        }}
        className="rounded-lg bg-[#4dae50e6] px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600">
        {filters.newColons.oil_co2 ? 'Remove Oil colons' : 'Add Oil colons'}
      </button>
      <button className="rounded-2xl bg-[#475746] p-2 text-white" onClick={onClose}>
        Close
      </button>
      <div className="grid-cols-6"></div>
    </div>
  );
}
