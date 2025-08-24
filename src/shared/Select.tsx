import { useCountriesStore, type Country } from '../store/CountryStore';

export default function Select({
  onSelect,
  error,
  ...props
}: {
  onSelect: (country: Country | null) => void;
  error?: string;
}) {
  const countries = useCountriesStore((state) => state.all);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;

    const selectedCountry = countries.find((c) => c.code === selectedCode);

    onSelect(selectedCountry || null);
  };

  return (
    <>
      <select
        {...props}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        <option value="" disabled selected>
          Select country...
        </option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </>
  );
}
