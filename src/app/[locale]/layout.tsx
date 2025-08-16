import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
export const metadata: Metadata = {
  title: 'PokeWiki',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          <Providers>
            <ThemeProvider>
              <div className="flex gap-10 items-center justify-center min-h-screen bg-white dark:bg-black">
                {children}
              </div>
            </ThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
