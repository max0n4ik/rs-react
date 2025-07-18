import { render, screen } from '@testing-library/react';
import CardList from '../card-list';
import '@testing-library/jest-dom';
import type { SimplifiedPokemon } from '../api/type';

const mockItems = [
  { name: 'Pikachu', description: 'Electric type', image: 'pikachu.png' },
  { name: 'Charmander', description: 'Fire type', image: 'charmander.png' },
];

describe('CardList Component', () => {
  it('renders correct number of items when data is provided', () => {
    render(<CardList items={mockItems} />);
    const cards = screen.getAllByRole('heading');
    expect(cards.length).toBe(mockItems.length);
  });

  it('displays "not found" message when data array is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('correctly displays item names and descriptions', () => {
    render(<CardList items={mockItems} />);
    mockItems.forEach(({ name, description }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('handles missing or undefined image gracefully', () => {
    const items = [
      { name: 'Bulbasaur', description: 'Grass type', image: undefined },
    ];
    render(<CardList items={items} />);
    const img = screen.getByRole('presentation');
    expect(img).not.toHaveAttribute('src', '');
  });

  it('handles unexpected data structure gracefully', () => {
    const brokenItems = [{ name: 'Mewtwo' } as SimplifiedPokemon];
    render(<CardList items={brokenItems} />);
    expect(screen.getByText('Mewtwo')).toBeInTheDocument();
  });
});
