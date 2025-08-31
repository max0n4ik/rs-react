import { useState } from 'react';
import type { Filters } from '../types/data-type';
import { createPortal } from 'react-dom';
import Modal from './Modal';

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const YEARS = Array.from({ length: 2023 - 1900 + 1 }, (_, i) => 1900 + i);

export function FilterSection({ filters, onChange }: Props) {
  const [showModal, setShowModal] = useState(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onChange({ ...filters, country: value });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange({
      ...filters,
      year: value ? Number(value) : null,
    });
  };

  return (
    <div className="flex gap-4 p-4 text-white">
      <input
        type="text"
        placeholder="Country"
        value={filters.country}
        onChange={handleSearch}
        className="rounded border border-white p-2 text-white"
        autoComplete="off"
      />

      <select value={filters.year ?? ''} onChange={handleSelect} className="rounded border border-white p-2 text-black">
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <button
        onClick={() => setShowModal(true)}
        className="rounded-lg bg-green-900 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-950">
        Select Colons
      </button>
      {showModal &&
        createPortal(
          <Modal onClose={() => setShowModal(false)} filters={filters} onChange={onChange} />,
          document.body
        )}
    </div>
  );
}
