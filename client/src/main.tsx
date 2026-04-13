import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { queryClient } from './lib/queryClient';
import App from './App';
import './styles/globals.css';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
          <App />
        </PayPalScriptProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
