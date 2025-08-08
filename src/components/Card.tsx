import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';
import { addCard, removeCard } from '@/store/CardSlice';
import type { RootState } from '@/store/Store';

type Props = {
  id: number;
  name: string;
  image?: string;
};

export default function Card({ id, name, image }: Props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.card.selectedPokemons
  );
  const isSelected = selectedPokemons.some((p: { id: number }) => p.id === id);
  const handleCheckboxChange = () => {
    if (isSelected) {
      dispatch(removeCard({ id: id }));
    } else {
      dispatch(addCard({ pokemon: { id, name, image } }));
    }
  };
  return (
    <Link
      to={{
        pathname: `detail/${id}`,
        search: location.search,
      }}
    >
      <div className="border p-4 rounded shadow bg-white dark:bg-black hover:shadow-md dark:border-white transition flex flex-col">
        <input
          className="size-4 self-end"
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange();
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <img src={image} alt="" className="render-pixel size-29 self-center" />
        <h2 className="text-lg font-semibold capitalize text-center dark:text-white">
          {name}
        </h2>
      </div>
    </Link>
  );
}
