import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {QueryProvider} from './components/providers/QueryProvider';
import {StoreProvider} from './components/providers/StoreProvider';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </QueryProvider>
  </React.StrictMode>,
);
