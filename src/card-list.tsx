import Card from './card';
import Pagination from './pagination';
import { useSearchParams } from 'react-router';

type Props = {
  items: {
    id: number;
    name: string;
    image?: string;
  }[];
};
const ITEMS_PER_PAGE = 9;

export default function CardList({ items }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Math.max(1, rawPage);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice(start, start + ITEMS_PER_PAGE);

  const changePage = (newPage: number) => {
    if (items.length <= 1 || totalPages <= 1) return;
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  if (items.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Not found</div>;
  }

  return (
    <>
      <div className="grid grid-cols gap-4 my-4 justify-center">
        {currentItems.map((item, index) => (
          <Card
            key={index}
            id={item.id}
            name={item.name}
            image={item.image ?? ''}
          />
        ))}
      </div>
      <Pagination currentPage={page} onChange={changePage} />
    </>
  );
}
