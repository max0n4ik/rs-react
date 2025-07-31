import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';
import { addCard, removeCard } from './store/card-slice';
import type { RootState } from './store/store';

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
      <div className="border p-4 rounded shadow bg-white hover:shadow-md transition flex flex-col">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange();
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <img src={image} alt="" className="render-pixel size-29 self-center" />
        <h2 className="text-lg font-semibold capitalize text-center">{name}</h2>
      </div>
    </Link>
  );
}
