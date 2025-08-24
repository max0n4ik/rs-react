import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Select from '../shared/Select';
import { useCountriesStore, type Country } from '../store/CountryStore';

vi.mock('../store/CountryStore');

const mockedUseCountriesStore = vi.mocked(useCountriesStore);

const mockCountries: Country[] = [
  { name: 'Russia', code: 'RU' },
  { name: 'USA', code: 'US' },
  { name: 'Germany', code: 'DE' },
];

describe('Select Component', () => {
  const mockOnSelect = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseCountriesStore.mockImplementation((selector) => {
      const mockState = {
        all: mockCountries,
        filtered: [],
        filterCountries: vi.fn(),
      };
      return selector(mockState);
    });
  });

  it('should render the default placeholder and all countries from the store', () => {
    render(<Select onSelect={mockOnSelect} />);

    expect(screen.getByRole('option', { name: 'Select country...' })).toBeInTheDocument();

    mockCountries.forEach((country) => {
      expect(screen.getByRole('option', { name: country.name })).toBeInTheDocument();
    });
  });

  it('should display an error message when the error prop is provided', () => {
    const errorMessage = 'Select your country';
    render(<Select onSelect={mockOnSelect} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should NOT display an error message when the error prop is absent', () => {
    const errorMessage = 'Select your country';
    render(<Select onSelect={mockOnSelect} />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it('should call onSelect with the correct country object when a user selects an option', async () => {
    const user = userEvent.setup();
    render(<Select onSelect={mockOnSelect} />);

    const selectElement = screen.getByRole('combobox');
    const countryToSelect = mockCountries[1];

    await user.selectOptions(selectElement, countryToSelect.code);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    expect(mockOnSelect).toHaveBeenCalledWith(countryToSelect);
  });

  it('should have the correct value after selection', async () => {
    const user = userEvent.setup();
    render(<Select onSelect={mockOnSelect} />);

    const selectElement = screen.getByRole('combobox');
    const countryToSelect = mockCountries[2];

    await user.selectOptions(selectElement, countryToSelect.code);

    expect(selectElement).toHaveValue(countryToSelect.code);
  });
});
