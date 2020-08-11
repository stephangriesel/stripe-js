import express, { Request, Response, NextFunction } from 'express';
export const app = express();

import cors from 'cors';
import { auth } from './firebase';
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { createSetupIntent, listPaymentMethods } from './customers';
import {
  createSubscription
} from './billing';

// ALLOW CROSS URL'S TO ACCESS
app.use(express.json());
import cors from 'cors';
app.use(cors({ origin: true }));

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 2 }); //
});

// RAWBODY FOR WEBHOOK HANDLING
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

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

// CUSTOMERS & SETUP INTENTS
// SAVE CARD ON CUSTOMER RECORD WITH SETUPINTENT
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

// RETRIEVE ALL CUSTOMER CARDS
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);


// DECODE FIREBASE TOKEN
app.use(decodeJWT);

// DECODE TOKEN & MAKE DATA AVAILABLE IN BODY
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}


// ERROR IF USER DOES NOT EXIST
function validateUser(req: Request) {
  const user = req['currentUser'];
  if (!user) {
    throw new Error(
      'You must be logged in to make this request. i.e Authroization: Bearer <token>'
    );
  }

  return user;
}

// CUSTOMER & SETUP INTENTS

// SAVE CARD FOR CUSTOMER INTENT
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

// GET ALL CARDS FOR CUSTOMER
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);

// BILLING & RECURRING SUBSCRIPTIONS

// CREATE & CHARGE A NEW SUBSCRIPTION
app.post(
  '/subscriptions/',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await createSubscription(user.uid, plan, payment_method);
    res.send(subscription);
  })
);
