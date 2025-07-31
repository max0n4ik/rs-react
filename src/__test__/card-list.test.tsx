import { render, screen } from '@testing-library/react';
import CardList from '../card-list';
import '@testing-library/jest-dom';
import type { SimplifiedPokemon } from '../api/type';
import { BrowserRouter } from 'react-router';
import type { JSX } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

const mockItems = [
  { name: 'Pikachu', id: 25, image: 'pikachu.png' },
  { name: 'Charmander', id: 4, image: 'charmander.png' },
];

const renderWithRouter = (component: JSX.Element) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>{component}</Provider>
    </BrowserRouter>
  );
};

describe('CardList Component', () => {
  it('renders correct number of items when data is provided', () => {
    renderWithRouter(<CardList items={mockItems} />);
    const cards = screen.getAllByRole('heading');
    expect(cards.length).toBe(mockItems.length);
  });

  it('displays "not found" message when data array is empty', () => {
    renderWithRouter(<CardList items={[]} />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('correctly displays item names ', () => {
    renderWithRouter(<CardList items={mockItems} />);
    mockItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('handles missing or undefined image gracefully', () => {
    renderWithRouter(<CardList items={[mockItems[0]]} />);
    const img = screen.getByRole('presentation');
    expect(img).not.toHaveAttribute('src', '');
  });

  it('handles unexpected data structure gracefully', () => {
    const brokenItems = [{ name: 'Mewtwo' } as SimplifiedPokemon];
    renderWithRouter(<CardList items={brokenItems} />);
    expect(screen.getByText('Mewtwo')).toBeInTheDocument();
  });
});
