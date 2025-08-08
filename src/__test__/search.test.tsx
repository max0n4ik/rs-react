import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/components/Search';
import * as api from '@/api/Api';
import type { SimplifiedPokemon } from '@/api/Type';
import { BrowserRouter } from 'react-router';

vi.mock('@/api/Api', () => ({
  fetchPokemon: vi.fn(),
}));

const mockData = [
  {
    name: 'Pikachu',
    image: 'pikachu.png',
  } as SimplifiedPokemon,
];

describe('Search Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders search input and search button', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', () => {
    localStorage.setItem('searchState', 'pikachu');
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('shows empty input when no saved term exists', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input value when user types', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  it('saves search term to localStorage when search button is clicked', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' charmander ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('charmander');
  });

  it('trims whitespace from search input before saving', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   squirtle   ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('squirtle');
  });

  it('triggers search callback with correct parameters', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' eevee ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(api.fetchPokemon).toHaveBeenCalledWith('eevee');
  });

  it('retrieves saved search term on component mount', () => {
    localStorage.setItem('searchState', 'gengar');
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    expect(screen.getByRole('textbox')).toHaveValue('gengar');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('searchState', 'oldterm');
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'newterm' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(localStorage.getItem('searchState')).toBe('newterm');
  });
});
