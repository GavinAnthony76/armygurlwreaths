import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { queryClient } from './lib/queryClient';
import App from './App';
import './styles/globals.css';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const hasPayPal = !!PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'test' && PAYPAL_CLIENT_ID !== 'paypal_placeholder';

function AppWithProviders() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {hasPayPal ? (
          <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID!, currency: 'USD' }}>
            <App />
          </PayPalScriptProvider>
        ) : (
          <App />
        )}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
