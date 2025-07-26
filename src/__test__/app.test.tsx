import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { App } from '../app';

import * as api from '../api/api';
import type { SimplifiedPokemon } from '../api/type';
import Search from '../search';
import { BrowserRouter } from 'react-router';

vi.mock('../api/api', () => ({
  fetchPokemon: vi.fn(),
}));

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

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(api.fetchPokemon).toHaveBeenCalledWith('');
    });
  });

  it('use localStorage for first search', async () => {
    localStorage.setItem('searchState', 'Pikachu');
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
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

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();

    resolvePromise(mockData);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('calls the API with the correct parameters when searching', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValueOnce(mockData);

    render(<Search onSearch={api.fetchPokemon} />);

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
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('displays an error message in case of API failure', async () => {
    vi.spyOn(api, 'fetchPokemon').mockRejectedValueOnce(
      new Error('Server unavailable')
    );

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/error: server unavailable/i)
      ).toBeInTheDocument();
    });
  });
});
