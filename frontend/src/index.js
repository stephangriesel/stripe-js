import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Elements } from '@stripe/react-stripe-js'; // PCI Compliance
import { loadStripe } from '@stripe/stripe-js'; // PCI Compliance

export const stripePromise = loadStripe(
  'pk_test_51H43ArKHyZwAWjBI6XoZzmpQNfGbRvRm4xhHYTJljukFQZaKBiOPuiRgJCY4XplntHMIhJHVqdxHmSjHgTXmedMi00qXetMXWh'
);

ReactDOM.render(
  <React.StrictMode>
    {/* Make stripe globally available */}
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
