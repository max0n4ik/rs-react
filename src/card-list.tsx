import Card from './card';

type Props = {
  items: {
    id: number;
    name: string;
    image?: string;
  }[];
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
          id={item.id}
          name={item.name}
          image={item.image ?? ''}
        />
      ))}
    </div>
  );
}
