import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailCard from '@/app/detail/[id]/page';
import { useGetPokemonDetailsQuery } from '@/api/api';
import type { DetailedPokemon } from '@/api/type';

type MockQueryResult = {
  data: DetailedPokemon | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

type MockMiddleware = (next: (action: unknown) => unknown) => (action: unknown) => unknown;

vi.mock('@/api/api', () => ({
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: vi.fn(() => ({})),
    middleware: vi.fn(
      () => ((next: (action: unknown) => unknown) => (action: unknown) => next(action)) as MockMiddleware
    ),
  },
  useGetPokemonDetailsQuery: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

const mockNavigate = vi.fn();

export const mockPokemonData: DetailedPokemon = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://example.com/bulbasaur.png  ',
  types: ['grass', 'poison'],
  abilities: [
    { name: 'overgrow', isHidden: false },
    { name: 'chlorophyll', isHidden: true },
  ],
  genderRatio: { male: 87.5, female: 12.5 },
  catchRate: 45,
  eggGroups: ['Monster', 'Grass'],
  hatchTime: 5120,
  height: 0.7,
  weight: 6.9,
  baseExp: 64,
  growthRate: 'medium-slow',
  evYield: {
    hp: 1,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 1,
    speed: 0,
  },
  color: 'green',
  shape: 'quadruped',
  baseFriendship: 70,
  footprint: 'https://example.com/footprint.png  ',
};

const mockPokemonDataGenderless: DetailedPokemon = {
  ...mockPokemonData,
  genderRatio: null,
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      pokemonApi: () => ({}),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

const renderComponent = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <DetailCard />
      </BrowserRouter>
    </Provider>
  );
};

describe('DetailCard', async () => {
  const mockUseParams = vi.mocked((await import('react-router')).useParams);
  const mockUseNavigate = vi.mocked((await import('react-router')).useNavigate);
  const mockUseLocation = vi.mocked((await import('react-router')).useLocation);
  const mockUseGetPokemonDetailsQuery = vi.mocked(useGetPokemonDetailsQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseLocation.mockReturnValue({
      search: '?page=1',
      state: undefined,
      key: '',
      pathname: '',
      hash: '',
    });
  });

  it('renders loading state initially', () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getAllByText('Loading...')).toHaveLength(2);
  });

  it('renders pokemon data after loading', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText('overgrow')).toBeInTheDocument();
    expect(screen.getByText('chlorophyll (Hidden Ability)')).toBeInTheDocument();
    expect(screen.getByText('87.5% male, 12.5% female')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
    expect(screen.getByText('6.9 kg')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
    expect(screen.getByText('medium-slow')).toBeInTheDocument();
    expect(screen.getByText('1 hp')).toBeInTheDocument();
    expect(screen.getByText('1 special-defense')).toBeInTheDocument();
  });

  it('renders genderless pokemon correctly', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonDataGenderless,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Genderless')).toBeInTheDocument();
    });
  });

  it('calls navigate when close button is clicked', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('..?page=1', { replace: true });
  });

  it('renders image with correct src and alt', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png  ');
      expect(image).toHaveAttribute('alt', 'Bulbasaur');
    });
  });

  it('renders abilities with correct styling for hidden abilities', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      const hiddenAbility = screen.getByText('chlorophyll (Hidden Ability)');
      expect(hiddenAbility).toHaveClass('italic', 'text-gray-500');

      const normalAbility = screen.getByText('overgrow');
      expect(normalAbility).not.toHaveClass('italic', 'text-gray-500');
    });
  });

  it('renders EV yield correctly when some values are 0', async () => {
    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    } satisfies MockQueryResult);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('1 hp')).toBeInTheDocument();
      expect(screen.getByText('0 attack')).toBeInTheDocument();
      expect(screen.getByText('1 special-defense')).toBeInTheDocument();
    });
  });

  it('renders error state correctly', () => {
    const errorResult = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 'FETCH_ERROR', error: 'Failed to fetch' },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetPokemonDetailsQuery>;

    mockUseGetPokemonDetailsQuery.mockReturnValue(errorResult);

    renderComponent();

    expect(screen.getByText('Ups')).toBeInTheDocument();
    expect(screen.getByText('Error with fetching')).toBeInTheDocument();
  });
});
