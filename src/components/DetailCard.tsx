'use client';

import { useGetPokemonDetailsQuery } from '@/app/api/api';
import { useRouter } from '@/i18n/navigation';
import { typeColors } from '@/utils/constants';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Loading from './Loading';

export default function DetailCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get('detail');
  const page = searchParams.get('page');
  const t = useTranslations('DetailCard');
  const { data, isLoading, isError } = useGetPokemonDetailsQuery(`${detailId}`);
  const prevPath = `?page=${page}`;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-red-600">
        <h2 className="text-xl font-bold mb-2">{t('Ups')}</h2>
        <h2 className="text-xl font-bold mb-2">{t('Error')}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center  text-center">
      <button
        className="inline-flex items-center gap-2 bg-[#60a5fa] text-white text-lg font-semibold py-3 px-6 rounded-md"
        onClick={() => router.replace(prevPath)}>
        {t('Close')}
      </button>
      {isLoading && <Loading />}
      <div className="max-w-xs mx-auto bg-white rounded-xl border-4 border-green-300 shadow-xl font-sans overflow-hidden text-sm dark:text-white dark:bg-black">
        <>
          <div className="bg-green-100 text-center py-2 border-b border-green-300 relative">
            <h2 className="text-lg font-bold capitalize dark:text-black">{data?.name}</h2>
            <span className="absolute top-2 right-2 bg-white border rounded px-2 text-black font-bold dark:text-white dark:bg-black">
              #{data?.id.toString().padStart(4, '0')}
            </span>
          </div>
          {isLoading && <Loading />}
          <Image
            src={data?.image ?? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'}
            width={116}
            height={116}
            alt="Bulbasaur"
            className="w-full h-auto object-contain render-pixel"
          />
          <div className="p-3 space-y-2">
            <p className="text-center">{t('Types')}</p>
            <div className="flex justify-center gap-2">
              {data?.types.map((type) => (
                <span
                  key={type}
                  className={classNames('px-2 py-1 rounded text-white capitalize', typeColors[type] || 'bg-gray-300')}>
                  {type}
                </span>
              ))}
            </div>

            <div className="">
              <p className="text-center">{t('Abilities')}</p>
              <div className="flex gap-2">
                {data?.abilities.map((a) => (
                  <div key={a.name} className={a.isHidden ? 'capitalize p-2 italic text-gray-500' : 'capitalize p-2'}>
                    {a.name} {a.isHidden && t('HidenA')}
                  </div>
                ))}
              </div>
            </div>

            {data?.genderRatio ? (
              <div>
                <strong>{t('GenderRation')}</strong>
                <div className="w-full h-3 bg-blue-300 relative rounded overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-pink-400"
                    style={{ width: `${data?.genderRatio.female}%` }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {data?.genderRatio.male.toFixed(1)}% {t('male')}, {data?.genderRatio.female.toFixed(1)}% {t('female')}
                </div>
              </div>
            ) : (
              <div>
                <strong>{t('Gender')}</strong> {t('Genderless')}
              </div>
            )}

            <div>
              <strong>{t('CatchRate')}</strong> {data?.catchRate}
            </div>

            <div>
              <strong>{t('EggGroup')}</strong> {data?.eggGroups?.join(', ')}
              <br />
              <strong>{t('HatchTime')}</strong> {data?.hatchTime} {t('steps')}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <strong>{t('Height')}</strong> {data?.height} {t('m')}
              </div>
              <div>
                <strong>{t('Weight')}</strong> {data?.weight} {t('kg')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <strong>{t('BaseEXP')}</strong> {data?.baseExp}
              </div>
              <div>
                <strong>{t('GrowthRate')}</strong> {data?.growthRate}
              </div>
            </div>

            <div>
              <strong>{t('EVyield')}</strong>
              {Object.entries(data?.evYield ?? {}).map(([stat, value]) => (
                <div key={stat}>
                  {value} {stat}
                </div>
              ))}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
