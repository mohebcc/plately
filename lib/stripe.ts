import Stripe from 'stripe';

// Create a singleton Stripe instance on the server to avoid reinitialising it
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    'STRIPE_SECRET_KEY is not set. Stripe functionality will not work until this environment variable is provided.'
  );
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })
  : ({} as Stripe);

/**
 * Create a Stripe Checkout Session for a restaurant subscription. The caller
 * should define the price ID in Stripe Dashboard and pass it to this function.
 * @param params Details about the subscription to create.
 */
export async function createSubscriptionCheckoutSession(params: {
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  if (!stripeSecretKey) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
  return session;
}

/**
 * Create a Checkout Session for one‑time setup fee. Useful when onboarding a
 * restaurant on a paid plan requiring an upfront fee.
 */
export async function createSetupFeeSession(params: {
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  if (!stripeSecretKey) {
    throw new Error('Stripe is not configured');
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
  return session;
}