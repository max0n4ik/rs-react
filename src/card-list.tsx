import type { SimplifiedPokemon } from './api/type';
import Card from './card';

type Props = {
  items: SimplifiedPokemon[];
};

export default function CardList({ items }: Props) {
  if (items.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Not found</div>;
  }

  return (
    <div className="grid grid-cols gap-4 mt-4 justify-center">
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
