import { stripe } from './';

// PAYMENT INTENT WITH SPECIFIC AMOUNT

export async function createPaymentIntent(amount: number) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        // receipt_email: 'hello@griesel.co.za',
    });

    paymentIntent.status

    return paymentIntent;
}
