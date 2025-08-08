import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import Card from '@/components/Card';
import type { RootState } from '@/store/Store';
import { cardSlice } from '@/store/CardSlice';

const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      card: cardSlice.reducer,
    },
    preloadedState: preloadedState as RootState | undefined,
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  preloadedState?: Partial<RootState>
) => {
  const store = createTestStore(preloadedState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
  };
};

const mockLocation = { search: '' };
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe('Card Component', () => {
  const mockProps = {
    id: 1,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
  };

  beforeEach(() => {
    mockLocation.search = '';
  });

  it('renders pokemon card with correct data', () => {
    renderWithProviders(<Card {...mockProps} />);

    expect(
      screen.getByRole('heading', { name: /pikachu/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      mockProps.image
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders without image when image prop is not provided', () => {
    const propsWithoutImage = { id: 1, name: 'pikachu' };
    renderWithProviders(<Card {...propsWithoutImage} />);

    expect(screen.getByRole('presentation')).not.toHaveAttribute('src');
  });

  it('creates correct link to detail page', () => {
    renderWithProviders(<Card {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/detail/1');
  });

  it('preserves search params in link', () => {
    mockLocation.search = '?page=1';

    renderWithProviders(<Card {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/detail/1?page=1');
  });

  it('shows unchecked checkbox when pokemon is not selected', () => {
    renderWithProviders(<Card {...mockProps} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows checked checkbox when pokemon is selected', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [{ id: 1, name: 'pikachu', image: mockProps.image }],
      },
    };

    renderWithProviders(<Card {...mockProps} />, preloadedState);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('adds pokemon to store when unchecked checkbox is clicked', () => {
    const { store } = renderWithProviders(<Card {...mockProps} />);

    expect(store.getState().card.selectedPokemons).toHaveLength(0);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(1);
    expect(state.card.selectedPokemons[0]).toEqual({
      id: mockProps.id,
      name: mockProps.name,
      image: mockProps.image,
    });
  });

  it('removes pokemon from store when checked checkbox is clicked', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [{ id: 1, name: 'pikachu', image: mockProps.image }],
      },
    };

    const { store } = renderWithProviders(
      <Card {...mockProps} />,
      preloadedState
    );

    expect(store.getState().card.selectedPokemons).toHaveLength(1);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(0);
  });

  it('maintains other selected pokemons when adding new one', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [
          { id: 2, name: 'charmander', image: 'charmander.png' },
        ],
      },
    };

    const { store } = renderWithProviders(
      <Card {...mockProps} />,
      preloadedState
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(2);
    expect(state.card.selectedPokemons).toContainEqual({
      id: 2,
      name: 'charmander',
      image: 'charmander.png',
    });
    expect(state.card.selectedPokemons).toContainEqual({
      id: mockProps.id,
      name: mockProps.name,
      image: mockProps.image,
    });
  });

  it('maintains other selected pokemons when removing one', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [
          { id: 1, name: 'pikachu', image: mockProps.image },
          { id: 2, name: 'charmander', image: 'charmander.png' },
        ],
      },
    };

    const { store } = renderWithProviders(
      <Card {...mockProps} />,
      preloadedState
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(1);
    expect(state.card.selectedPokemons[0]).toEqual({
      id: 2,
      name: 'charmander',
      image: 'charmander.png',
    });
  });

  it('checkbox state updates correctly after multiple clicks', () => {
    const { store } = renderWithProviders(<Card {...mockProps} />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(store.getState().card.selectedPokemons).toHaveLength(1);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(store.getState().card.selectedPokemons).toHaveLength(0);

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(store.getState().card.selectedPokemons).toHaveLength(1);
  });

  it('stops event propagation on onClick handler', () => {
    renderWithProviders(<Card {...mockProps} />);

    const checkbox = screen.getByRole('checkbox');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

    fireEvent(checkbox, clickEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('handles pokemon selection state correctly for different IDs', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [
          { id: 2, name: 'charmander', image: 'charmander.png' },
        ],
      },
    };

    renderWithProviders(<Card {...mockProps} />, preloadedState);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('works correctly with pokemon without image', () => {
    const propsWithoutImage = { id: 3, name: 'bulbasaur' };
    const { store } = renderWithProviders(<Card {...propsWithoutImage} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(1);
    expect(state.card.selectedPokemons[0]).toEqual({
      id: 3,
      name: 'bulbasaur',
      image: undefined,
    });
  });

  it('integrates correctly with real store selector', () => {
    const preloadedState = {
      card: {
        selectedPokemons: [
          { id: 1, name: 'pikachu', image: 'pikachu.png' },
          { id: 4, name: 'squirtle', image: 'squirtle.png' },
        ],
      },
    };

    const { store } = renderWithProviders(
      <Card {...mockProps} />,
      preloadedState
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.card.selectedPokemons).toHaveLength(1);
    expect(state.card.selectedPokemons[0].id).toBe(4);
  });
});
