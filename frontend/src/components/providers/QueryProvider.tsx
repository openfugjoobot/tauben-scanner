/**
 * React Query Provider Component
 * T3: State Management
 */

import {ReactNode} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {queryClient, getDevtoolsOptions} from '../../services/queryClient';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({children}: QueryProviderProps) => {
  const isDev = (__DEV__ === true) || process?.env?.NODE_ENV === 'development' || import.meta.env.DEV;
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev && (
        <ReactQueryDevtools {...getDevtoolsOptions()} />
      )}
    </QueryClientProvider>
  );
};
