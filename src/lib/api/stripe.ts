import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe - deve ser configurada em variáveis de ambiente
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export const stripePromise = loadStripe(stripePublishableKey);

export const stripeConfig = {
  publishableKey: stripePublishableKey,
  currency: 'brl', // Será sobrescrito dinamicamente baseado no idioma
  locale: 'pt-BR', // Será sobrescrito dinamicamente baseado no idioma
};

// Função para obter configuração do Stripe baseada no idioma
export function getStripeConfigForLanguage(language: string) {
  const languageToCurrency: Record<string, string> = {
    'pt': 'brl',
    'pt-BR': 'brl',
    'en': 'usd',
    'en-US': 'usd',
    'en-GB': 'gbp',
    'es': 'eur',
    'fr': 'eur',
    'de': 'eur',
    'it': 'eur',
  };

  const languageToLocale: Record<string, 'auto' | 'da' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'it' | 'ja' | 'nb' | 'nl' | 'pl' | 'pt' | 'sv' | 'zh'> = {
    'pt': 'pt',
    'pt-BR': 'pt',
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
  };

  return {
    currency: languageToCurrency[language] || 'usd',
    locale: languageToLocale[language] || 'en',
  };
} 