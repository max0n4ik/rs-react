import { Link } from 'react-router';

type Props = {
  id: number;
  name: string;
  image?: string;
};

export default function Card({ id, name, image }: Props) {
  return (
    <Link to={`/detail/${id}`}>
      <div className="border p-4 rounded shadow bg-white hover:shadow-md transition flex flex-col">
        <img src={image} alt="" className="render-pixel size-29 self-center" />
        <h2 className="text-lg font-semibold capitalize text-center">{name}</h2>
      </div>
    </Link>
  );
}
