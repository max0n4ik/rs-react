import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { App } from '../app';

import * as api from '../api/api';
import type { SimplifiedPokemon } from '../api/type';
import Search from '../search';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import type { JSX } from 'react';
import cardSlice from '../store/card-slice';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../api/api', () => ({
  fetchPokemon: vi.fn(),
}));

const renderWithRouter = (component: JSX.Element) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>{component}</Provider>
    </BrowserRouter>
  );
};

const mockData = [
  {
    name: 'Pikachu',
    image: 'pikachu.png',
  } as SimplifiedPokemon,
];

describe('App Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('Initialization call API ', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);

    renderWithRouter(<App />);
    await waitFor(() => {
      expect(api.fetchPokemon).toHaveBeenCalledWith('');
    });
  });

  it('use localStorage for first search', async () => {
    localStorage.setItem('searchState', 'Pikachu');
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);

    renderWithRouter(<App />);
    await waitFor(() => {
      expect(api.fetchPokemon).toHaveBeenCalledWith('Pikachu');
    });
  });

  it('render loading indicator', async () => {
    let resolvePromise: (value: SimplifiedPokemon[]) => void = () => {};
    const pendingPromise = new Promise<SimplifiedPokemon[]>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(api, 'fetchPokemon').mockReturnValueOnce(pendingPromise);

    renderWithRouter(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    resolvePromise(mockData);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('calls the API with the correct parameters when searching', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);

    render(
      <BrowserRouter>
        <Search onSearch={api.fetchPokemon} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'bulbasaur' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.fetchPokemon).toHaveBeenCalledWith('bulbasaur');
    });
  });

  it('processes the successful API response and displays the cards', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    renderWithRouter(<App />);
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('displays an error message in case of API failure', async () => {
    vi.spyOn(api, 'fetchPokemon').mockRejectedValueOnce(
      new Error('Server unavailable')
    );

    renderWithRouter(<App />);
    await waitFor(() => {
      expect(
        screen.getByText(/error: server unavailable/i)
      ).toBeInTheDocument();
    });
  });

  it('renders a card as selected if it is already in the Redux store', () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);
    const preloadedState = {
      card: {
        selectedPokemons: [{ id: 25, name: 'Pikachu', image: 'pikachu.png' }],
      },
    };

    const storeWithPreloadedState = configureStore({
      reducer: { card: cardSlice },
      preloadedState,
    });

    render(
      <BrowserRouter>
        <Provider store={storeWithPreloadedState}>
          <App />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });
});
