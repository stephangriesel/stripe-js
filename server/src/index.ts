// ENV Variables
import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  config();
}

// INIT STRIPE
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-03-02',
});

console.log('Stripe initialized');

// START API WITH EXPRESS
import { app } from './api';
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Started on http://localhost:${port}`));
