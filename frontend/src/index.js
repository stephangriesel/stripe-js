import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Elements } from '@stripe/react-stripe-js'; // PCI Compliance
import { loadStripe } from '@stripe/stripe-js'; // PCI Compliance

import { FirebaseAppProvider } from 'reactfire';

export const stripePromise = loadStripe(
  'pk_test_51H43ArKHyZwAWjBI6XoZzmpQNfGbRvRm4xhHYTJljukFQZaKBiOPuiRgJCY4XplntHMIhJHVqdxHmSjHgTXmedMi00qXetMXWh'
);

export const firebaseConfig = {
  apiKey: "AIzaSyBUStwVZRStOBl2ZRZ_O1Ze-BFnj2NENBQ",
  authDomain: "stripe-js.firebaseapp.com",
  databaseURL: "https://stripe-js.firebaseio.com",
  projectId: "stripe-js",
  storageBucket: "stripe-js.appspot.com",
  messagingSenderId: "851900051481",
  appId: "1:851900051481:web:f7f0d974c38304c865ba88",
  measurementId: "G-FJ2N39YDK0"
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig} />
    {/* Make stripe globally available */}
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
