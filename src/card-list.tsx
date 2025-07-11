import { Component } from 'react';
import { Card } from './card';
import type { SimplifiedPokemon } from './api/type';

type Props = {
  items: SimplifiedPokemon[];
};

export default class CardList extends Component<Props> {
  render() {
    const { items } = this.props;

    if (items.length === 0) {
      return <div className="text-center text-gray-500 mt-8">Not found</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {items.map((item, index) => (
          <Card
            key={index}
            name={item.name}
            description={item.description}
            image={item.image ?? ''}
          />
        ))}
      </div>
    );
  }
}
