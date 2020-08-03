import { stripe } from './';
import Stripe from 'stripe';

// LOGIC FOR WEBHOOK EVENT TYPES
const webhookHandlers = {

    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
        // LOGIC
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
        // LOGIC
    },
}

// VALIDATE & CALL HANDLER
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);

    try {
        await webhookHandlers[event.type](event.data.object);
        res.send({ received: true });
    } catch (err) {
        console.error(err)
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}