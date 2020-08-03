import express from 'express';
export const app = express();
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';

// ALLOW CROSS URL'S TO ACCESS
app.use(express.json());
import cors from 'cors';
app.use(cors({ origin: true }));

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 2 }); //
});

// CHECKOUT
app.post(
  '/checkouts/',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

// CATCH ERRORS
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

// PAYMENT INTENTS
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await createPaymentIntent(body.amount)
    );
  })
);
