import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function createCheckoutSession(
  items: Array<{ name: string; amount: number; quantity: number }>,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function createCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function listPayments(limit: number = 100) {
  return await stripe.paymentIntents.list({ limit });
}