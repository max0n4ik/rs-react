import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/components/Search';
import { ThemeContext } from '@/store/ContextStore';
import * as searchSlice from '@/store/SearchSlice';
import '@testing-library/jest-dom';

const mockDispatch = vi.fn();
const mockSetSearchState = vi.fn();
const mockSetSearchParams = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('@/hooks/UseLocalStorage', () => ({
  default: () => ['test-value', mockSetSearchState],
}));

vi.mock('@/store/store', () => ({
  useRootDispatch: () => mockDispatch,
}));

vi.mock('react-router', () => ({
  useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
}));

vi.mock('@/store/searchSlice', () => ({
  setSearchTerm: vi.fn((term) => ({ type: 'search/setSearchTerm', payload: term })),
}));

describe('Search Component', () => {
  const renderComponent = (theme = 'light') => {
    return render(
      <ThemeContext.Provider value={{ theme, toggleTheme: mockToggleTheme }}>
        <Search />
      </ThemeContext.Provider>
    );
  };

  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByText('Pokewiki')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'light' })).toBeInTheDocument();
  });

  it('should display the value from useLocalStorage', () => {
    renderComponent();
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('test-value');
  });

  it('should call setSearchState on input change', () => {
    renderComponent();
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    expect(mockSetSearchState).toHaveBeenCalledWith('pikachu');
  });

  it('should call handleSearch and its dependencies on button click', () => {
    renderComponent();
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSetSearchState).toHaveBeenCalledWith('test-value');
    expect(mockDispatch).toHaveBeenCalledWith(searchSlice.setSearchTerm('test-value'));
  });

  it('should call handleSearch on Enter key press', () => {
    renderComponent();
    const searchInput = screen.getByRole('textbox');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    expect(mockSetSearchParams).toHaveBeenCalledTimes(2);
    expect(mockSetSearchState).toHaveBeenCalledWith('test-value');
    expect(mockDispatch).toHaveBeenCalledWith(searchSlice.setSearchTerm('test-value'));
  });

  it('should call toggleTheme on theme button click', () => {
    renderComponent();
    const themeButton = screen.getByRole('button', { name: 'light' });
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
