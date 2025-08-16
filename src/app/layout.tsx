import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export default function RootLayout({ children, detail }: { children: React.ReactNode; detail: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider>
            <div className="flex gap-10 items-center justify-center min-h-screen bg-white dark:bg-black">
              {children}
              {detail}
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
