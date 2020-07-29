import express from 'express';
export const app = express();

// ALLOW CROSS URL'S TO ACCESS
app.use(express.json());
import cors from 'cors';
app.use(cors({ origin: true }));

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 2 }); //
});
