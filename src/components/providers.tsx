'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>;
    </QueryClientProvider>
  );
}
