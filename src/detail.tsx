import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchPokemonDetails } from './api/api';
import type { SimplifiedPokemon } from './api/type';
import { API, typeColors } from './utils/constants';
import classNames from 'classnames';

export default function DetailCard() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<SimplifiedPokemon>();

  useEffect(() => {
    fetchPokemonDetails(`${API.API_URL}/${params.id}`).then((data) => {
      setData(data);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col items-center justify-center  text-center">
      <div className="max-w-xs mx-auto bg-white rounded-xl border-4 border-green-300 shadow-xl font-sans overflow-hidden text-sm">
        <div className="bg-green-100 text-center py-2 border-b border-green-300 relative">
          <h2 className="text-lg font-bold capitalize">{data?.name}</h2>
          <p className="text-xs italic text-gray-700">
            <span>{}</span> — Fushigidane
          </p>
          <span className="absolute top-2 right-2 bg-white border rounded px-2 text-black font-bold">
            #{data?.id.toString().padStart(4, '0')}
          </span>
        </div>

        <img
          src={data?.image}
          alt="Bulbasaur"
          className="w-full h-auto object-contain render-pixel bg-white"
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
      </div>
      <button
        className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
        onClick={() => navigate('/')}
      >
        Закрыть
      </button>
    </div>
  );
}
