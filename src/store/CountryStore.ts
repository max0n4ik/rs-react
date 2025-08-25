import { create } from 'zustand';

export interface Country {
  code: string;
  name: string;
}

interface CountriesState {
  all: Country[];
}

export const useCountriesStore = create<CountriesState>(() => ({
  all: [
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'EE', name: 'Estonia' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'GR', name: 'Greece' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IT', name: 'Italy' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MT', name: 'Malta' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'ES', name: 'Spain' },
    { code: 'SE', name: 'Sweden' },
  ],
}));

export const selectAllCountries = () => useCountriesStore.getState().all;

export const selectGetByCode = (code: string) => useCountriesStore.getState().all.find((c) => c.code === code);

export const selectFilterByQuery = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return useCountriesStore
    .getState()
    .all.filter(
      (country) =>
        country.name.toLowerCase().includes(normalizedQuery) || country.code.toLowerCase().includes(normalizedQuery)
    );
};
