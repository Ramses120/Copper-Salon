import Stripe from 'stripe';

// Stripe es opcional - solo se configura si existe la clave
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_')) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
  });
}

export { stripe };

export interface PaymentIntentData {
  amount: number; // en centavos
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(data: PaymentIntentData) {
  if (!stripe) {
    throw new Error('Stripe no está configurado. STRIPE_SECRET_KEY no está definido.');
  }

  const { amount, currency = 'usd', description, metadata } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convertir a centavos
    currency,
    description,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe no está configurado.');
  }
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe no está configurado.');
  }
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  if (!stripe) {
    throw new Error('Stripe no está configurado.');
  }

  const refundData: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundData.amount = Math.round(amount * 100);
  }

  return await stripe.refunds.create(refundData);
}
