import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Search from '../search';

describe('Search Component', () => {
  const onSearchMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders search input and search button', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', () => {
    localStorage.setItem('searchState', 'pikachu');
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('shows empty input when no saved term exists', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  it('saves search term to localStorage when search button is clicked', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' charmander ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('charmander');
  });

  it('trims whitespace from search input before saving', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   squirtle   ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('squirtle');
  });

  it('triggers search callback with correct parameters', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' eevee ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearchMock).toHaveBeenCalledWith('eevee');
  });

  it('retrieves saved search term on component mount', () => {
    localStorage.setItem('searchState', 'gengar');
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('gengar');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('searchState', 'oldterm');
    render(<Search onSearch={onSearchMock} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'newterm' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('newterm');
  });
});
