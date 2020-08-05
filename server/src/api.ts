import express from 'express';
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { auth } from './firebase';

export const app = express();

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
// app.get(
//   '/wallet',
//   runAsync(async (req: Request, res: Response) => {
//     const user = validateUser(req);

//     const wallet = await listPaymentMethods(user.uid);
//     res.send(wallet.data);
//   })
// );


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
