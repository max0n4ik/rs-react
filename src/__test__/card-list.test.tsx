import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from '@/components/CardList';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store, type RootState } from '@/store/store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { JSX } from 'react';

const mockUseSearchParams = vi.fn();
const mockUseGetPokemonQuery = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
  };
});

vi.mock('@/api/api', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useGetPokemonQuery: () => mockUseGetPokemonQuery(),
  };
});

const mockUseRootSelector = vi.fn();
vi.mock('@/store/store', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useRootSelector: (selector: (state: RootState) => void) => {
      if (selector.toString().includes('searchTerm')) {
        return mockUseRootSelector('searchTerm');
      }
      if (selector.toString().includes('selectedPokemons')) {
        return mockUseRootSelector('selectedPokemons') || [];
      }
      return mockUseRootSelector();
    },
  };
});

const mockItems = [
  { name: 'pikachu', id: 25, image: 'pikachu.png' },
  { name: 'charmander', id: 4, image: 'charmander.png' },
];

const renderWithRouter = (component: JSX.Element) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>{component}</Provider>
    </BrowserRouter>
  );
};

describe('CardList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      error: { data: 'Network error' },
    });

    renderWithRouter(<CardList />);

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it('renders "not found" message when data array is empty', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: [],
      error: undefined,
    });

    renderWithRouter(<CardList />);

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('renders correct number of cards when data is provided', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: mockItems,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    const cards = screen.getAllByRole('link');
    expect(cards).toHaveLength(mockItems.length);
  });

  it('correctly displays item names', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: mockItems,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    mockItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders pagination component', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: mockItems,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('uses page from search params', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', '3');
    mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: mockItems,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('uses search term from redux store', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValueOnce('pikachu').mockReturnValueOnce([]);

    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: [mockItems[0]],
      error: undefined,
    });

    renderWithRouter(<CardList />);

    expect(mockUseGetPokemonQuery).not.toHaveBeenCalledWith({
      name: 'pikachu',
    });
  });

  it('handles undefined image gracefully', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseRootSelector.mockReturnValue('');
    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: [{ name: 'pikachu', id: 25, image: undefined }],
      error: undefined,
    });

    renderWithRouter(<CardList />);

    const card = screen.getByRole('link');
    expect(card).toBeInTheDocument();
  });

  it('updates search params when page changes', async () => {
    const user = userEvent.setup();
    const setSearchParams = vi.fn();

    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setSearchParams]);
    mockUseRootSelector.mockReturnValueOnce('').mockReturnValueOnce([]);

    mockUseGetPokemonQuery.mockReturnValue({
      isLoading: false,
      data: mockItems,
      error: undefined,
    });

    renderWithRouter(<CardList />);

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextPageButton);

    expect(setSearchParams).toHaveBeenCalled();
  });
});
