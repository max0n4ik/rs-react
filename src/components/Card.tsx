import clsx from 'clsx';
import type { Submission } from '../store/FormsStore';

type HighlightMap = {
  name?: boolean;
  age?: boolean;
  gender?: boolean;
  email?: boolean;
  password?: boolean;
  acceptedTC?: boolean;
  image?: boolean;
  country?: boolean;
};

export default function Card({ card, highlight }: { card: Submission; highlight?: HighlightMap }) {
  return (
    <div className="max-w-md min-w-[300px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-full border">
            #{card.id.length > 6 ? card.id.substring(0, 6) + '...' : card.id}
          </span>
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full border">{card.origin}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start space-x-4">
          <img
            src={card.image.base64}
            alt="Profile"
            className={clsx(
              'w-16 h-16 rounded-full object-cover border-2 border-white shadow',
              highlight?.image && 'ring-4 ring-green-300'
            )}
          />
          <div className="flex-1 min-w-0">
            <h2
              className={clsx(
                'text-lg font-semibold text-gray-800 truncate p-1 rounded-md',
                highlight?.name && 'bg-green-100'
              )}>
              {card.name}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <span className={clsx('p-1 rounded-md', highlight?.age && 'bg-green-100')}>{card.age} years</span>
              <span>•</span>
              <span className={clsx('flex items-center p-1 rounded-md', highlight?.gender && 'bg-green-100')}>
                {card.gender}
              </span>
            </div>
            <p
              className={clsx(
                'text-sm text-blue-600 truncate p-1 rounded-md mt-1',
                highlight?.email && 'bg-green-100'
              )}>
              {card.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Country</p>
            <p className={clsx('font-medium p-1 rounded-md', highlight?.country && 'bg-green-100')}>
              {card.country.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Password</p>
            <p className={clsx('font-mono text-gray-700 p-1 rounded-md', highlight?.password && 'bg-green-100')}>
              {card.password}
            </p>
          </div>
        </div>

        <div
          className={clsx(
            'flex items-center space-x-2 text-sm p-1 rounded-md',
            highlight?.acceptedTC && 'bg-green-100'
          )}>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center ${
              card.acceptedTC ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
            {card.acceptedTC ? '✓' : '✗'}
          </div>
          <span className={card.acceptedTC ? 'text-green-600' : 'text-red-600'}>
            Terms {card.acceptedTC ? 'Accepted' : 'Declined'}
          </span>
        </div>
      </div>
    </div>
  );
}
