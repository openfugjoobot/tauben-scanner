import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import {QueryProvider} from './components/providers/QueryProvider';
import {StoreProvider} from './components/providers/StoreProvider';
import './styles.css';
import { createQueryClient } from './hooks';

// Create QueryClient instance
const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<<<<<<< HEAD
    <QueryProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </QueryProvider>
=======
    <QueryClientProvider client={queryClient}>
      <QueryProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </QueryProvider>
    </QueryClientProvider>
>>>>>>> main
  </React.StrictMode>,
);
