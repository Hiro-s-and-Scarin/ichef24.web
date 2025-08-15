import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe - deve ser configurada em variáveis de ambiente
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export const stripePromise = loadStripe(stripePublishableKey);

export const stripeConfig = {
  publishableKey: stripePublishableKey,
  currency: 'brl',
  locale: 'pt-BR',
}; 