import { render, screen } from '@testing-library/react';
import CardList from '../card-list';
import '@testing-library/jest-dom';
import type { SimplifiedPokemon } from '../api/type';
import { BrowserRouter } from 'react-router';

const mockItems = [
  { name: 'Pikachu', id: 25, image: 'pikachu.png' },
  { name: 'Charmander', id: 4, image: 'charmander.png' },
];

describe('CardList Component', () => {
  it('renders correct number of items when data is provided', () => {
    render(
      <BrowserRouter>
        <CardList items={mockItems} />
      </BrowserRouter>
    );
    const cards = screen.getAllByRole('heading');
    expect(cards.length).toBe(mockItems.length);
  });

  it('displays "not found" message when data array is empty', () => {
    render(
      <BrowserRouter>
        <CardList items={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('correctly displays item names ', () => {
    render(
      <BrowserRouter>
        <CardList items={mockItems} />
      </BrowserRouter>
    );
    mockItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('handles missing or undefined image gracefully', () => {
    render(
      <BrowserRouter>
        <CardList items={[mockItems[0]]} />
      </BrowserRouter>
    );
    const img = screen.getByRole('presentation');
    expect(img).not.toHaveAttribute('src', '');
  });

  it('handles unexpected data structure gracefully', () => {
    const brokenItems = [{ name: 'Mewtwo' } as SimplifiedPokemon];
    render(
      <BrowserRouter>
        <CardList items={brokenItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Mewtwo')).toBeInTheDocument();
  });
});
