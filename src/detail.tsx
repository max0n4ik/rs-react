import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { fetchPokemonDetails } from './api/api';
import type { SimplifiedPokemon } from './api/type';
import { API, typeColors } from './utils/constants';
import classNames from 'classnames';

export default function DetailCard() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<SimplifiedPokemon>();
  const [loading, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
    fetchPokemonDetails(`${API.API_URL}${params.id}`).then((data) => {
      setData(data);
      setLoad(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col items-center justify-center  text-center">
      {loading && (
        <div role="status" className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <div className="max-w-xs mx-auto bg-white rounded-xl border-4 border-green-300 shadow-xl font-sans overflow-hidden text-sm dark:text-white dark:bg-black">
        {!loading && (
          <>
            <div className="bg-green-100 text-center py-2 border-b border-green-300 relative">
              <h2 className="text-lg font-bold capitalize dark:text-black">
                {data?.name}
              </h2>
              <span className="absolute top-2 right-2 bg-white border rounded px-2 text-black font-bold dark:text-white dark:bg-black">
                #{data?.id.toString().padStart(4, '0')}
              </span>
            </div>
            <img
              src={data?.image}
              alt="Bulbasaur"
              className="w-full h-auto object-contain render-pixel"
            />
            <div className="p-3 space-y-2">
              <p className="text-center">Types:</p>
              <div className="flex justify-center gap-2">
                {data?.types.map((type) => (
                  <span
                    key={type}
                    className={classNames(
                      'px-2 py-1 rounded text-white capitalize',
                      typeColors[type] || 'bg-gray-300'
                    )}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="">
                <p className="text-center">Abilities:</p>
                <div className="flex gap-2">
                  {data?.abilities.map((a) => (
                    <div
                      key={a.name}
                      className={
                        a.isHidden
                          ? 'capitalize p-2 italic text-gray-500'
                          : 'capitalize p-2'
                      }
                    >
                      {a.name} {a.isHidden && '(Hidden Ability)'}
                    </div>
                  ))}
                </div>
              </div>

              {data?.genderRatio ? (
                <div>
                  <strong>Gender ratio:</strong>
                  <div className="w-full h-3 bg-blue-300 relative rounded overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-pink-400"
                      style={{ width: `${data?.genderRatio.female}%` }}
                    />
                  </div>
                  <div className="text-xs mt-1 text-gray-600">
                    {data?.genderRatio.male.toFixed(1)}% male,{' '}
                    {data?.genderRatio.female.toFixed(1)}% female
                  </div>
                </div>
              ) : (
                <div>
                  <strong>Gender:</strong> Genderless
                </div>
              )}

              <div>
                <strong>Catch rate:</strong> {data?.catchRate}
              </div>

              <div>
                <strong>Egg Groups:</strong> {data?.eggGroups.join(', ')}
                <br />
                <strong>Hatch time:</strong> {data?.hatchTime} steps
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Height:</strong> {data?.height} m
                </div>
                <div>
                  <strong>Weight:</strong> {data?.weight} kg
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Base EXP:</strong> {data?.baseExp}
                </div>
                <div>
                  <strong>Growth rate:</strong> {data?.growthRate}
                </div>
              </div>

              <div>
                <strong>EV yield:</strong>
                {Object.entries(data?.evYield ?? {}).map(([stat, value]) => (
                  <div key={stat}>
                    {value} {stat}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <button
        className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
        onClick={() => navigate('..' + location.search, { replace: true })}
      >
        Close
      </button>
    </div>
  );
}
