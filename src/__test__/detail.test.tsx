import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DetailCard from '../detail';
import * as api from '../api/api';
import type { SimplifiedPokemon } from '../api/type';
import type { JSX } from 'react/jsx-runtime';

vi.mock('../api/api', () => ({
  fetchPokemonDetails: vi.fn(),
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

const mockPokemonData = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://example.com/bulbasaur.png',
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
  footprint: 'https://example.com/footprint.png',
} as SimplifiedPokemon;

const mockPokemonDataGenderless = {
  ...mockPokemonData,
  genderRatio: null,
} as SimplifiedPokemon;

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <DetailCard />
    </BrowserRouter>
  );
};

describe('DetailCard', async () => {
  const mockUseParams = vi.mocked((await import('react-router')).useParams);
  const mockUseNavigate = vi.mocked((await import('react-router')).useNavigate);
  const mockUseLocation = vi.mocked((await import('react-router')).useLocation);

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
    vi.spyOn(api, 'fetchPokemonDetails').mockReturnValue(new Promise(() => {}));

    renderComponent();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders pokemon data after loading', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    expect(screen.getByText('#0001')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText('overgrow')).toBeInTheDocument();
    expect(
      screen.getByText('chlorophyll (Hidden Ability)')
    ).toBeInTheDocument();
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
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(
      mockPokemonDataGenderless
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Genderless')).toBeInTheDocument();
    });
  });

  it('calls navigate when close button is clicked', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('..?page=1', { replace: true });
  });

  it('fetches pokemon details with correct API URL', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    await act(async () => {
      renderComponent();
    });

    expect(api.fetchPokemonDetails).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1'
    );
  });

  it('refetches data when params.id changes', async () => {
    const spy = vi
      .spyOn(api, 'fetchPokemonDetails')
      .mockResolvedValue(mockPokemonData);

    let rerender: (arg0: JSX.Element) => void;
    await act(async () => {
      ({ rerender } = renderComponent());
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');

    mockUseParams.mockReturnValue({ id: '2' });

    await act(async () => {
      rerender(
        <BrowserRouter>
          <DetailCard />
        </BrowserRouter>
      );
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('https://pokeapi.co/api/v2/pokemon/2');
  });

  it('renders image with correct src and alt', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    renderComponent();

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
      expect(image).toHaveAttribute('alt', 'Bulbasaur');
    });
  });

  it('renders abilities with correct styling for hidden abilities', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    renderComponent();

    await waitFor(() => {
      const hiddenAbility = screen.getByText('chlorophyll (Hidden Ability)');
      expect(hiddenAbility).toHaveClass('italic', 'text-gray-500');

      const normalAbility = screen.getByText('overgrow');
      expect(normalAbility).not.toHaveClass('italic', 'text-gray-500');
    });
  });

  it('renders EV yield correctly when some values are 0', async () => {
    vi.spyOn(api, 'fetchPokemonDetails').mockResolvedValue(mockPokemonData);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('1 hp')).toBeInTheDocument();
      expect(screen.getByText('0 attack')).toBeInTheDocument();
      expect(screen.getByText('1 special-defense')).toBeInTheDocument();
    });
  });
});
