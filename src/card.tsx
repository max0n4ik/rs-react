import type { CardProps } from './api/type';

export default function Card({ name, image, description }: CardProps) {
  return (
    <div className="border p-4 rounded shadow bg-white hover:shadow-md transition flex flex-col">
      <img src={image} alt="" className="render-pixel size-24 self-center" />
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
