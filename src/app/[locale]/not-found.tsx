'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <section className="bg-white min-h-screen flex items-center justify-center dark:bg-black">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[#60a5fa] ">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            {t('miss')}
          </p>
          <p className="mb-4 text-lg font-medium text-gray-500 ">{t('sorry')}</p>
          <Link
            href="/"
            className="inline-flex text-white bg-[#60a5fa] hover:bg-[#1e40af] focus:ring-4 focus:outline-none focus:ring-[#93c5fd] font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
            {t('back')}
          </Link>
        </div>
      </div>
    </section>
  );
}
