import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '@/api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import cardReducer from '@/store/CardSlice.ts';
import searchReducer from '@/store/SearchSlice';
import { App } from '@/app/page';

const mockUseGetPokemonQuery = vi.fn();

vi.mock('@/api/api', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useGetPokemonQuery: (args: unknown) => mockUseGetPokemonQuery(args),
  };
});

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

const mockPokemonListData = [
  { id: 1, name: 'bulbasaur', image: '' },
  { id: 2, name: 'charmander', image: '' },
];

const createMockStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
      card: cardReducer,
      search: searchReducer,
    },
    middleware: (gdm) => gdm().concat(pokemonApi.middleware),
  });

const renderComponent = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component Integration Tests', async () => {
  const mockedUseNavigate = vi.mocked((await import('react-router')).useNavigate);
  const mockedUseLocation = vi.mocked((await import('react-router')).useLocation);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(vi.fn());
    mockedUseLocation.mockReturnValue({
      search: '',
      state: undefined,
      key: 'default-key',
      pathname: '/',
      hash: '',
    });
    mockUseGetPokemonQuery.mockReturnValue({ data: mockPokemonListData, isLoading: false, error: undefined });
  });

  it('renders loading state initially', () => {
    mockUseGetPokemonQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    renderComponent();

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders pokemon list on successful data fetch', async () => {
    mockUseGetPokemonQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: undefined,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });
  });

  it('displays an error message when the API fails', async () => {
    mockUseGetPokemonQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 404, data: 'Not Found' },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('calls the API with the correct parameters when the search button is clicked', async () => {
    mockUseGetPokemonQuery.mockReturnValue({ data: mockPokemonListData, isLoading: false, error: undefined });

    renderComponent();

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const lastCallArgs = mockUseGetPokemonQuery.mock.calls.at(-1)?.[0] as { name: string; offset: number };
      expect(lastCallArgs).toMatchObject({ name: 'pikachu', offset: 0 });
    });
  });
});
