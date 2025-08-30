import { useTranslation } from "react-i18next";

// Mapeamento de idiomas para moedas padrão
const languageToCurrency: Record<string, string> = {
  pt: "BRL",
  "pt-BR": "BRL",
  en: "USD",
  "en-US": "USD",
  "en-GB": "GBP",
  es: "EUR",
  fr: "EUR",
  de: "EUR",
  it: "EUR",
};

// Mapeamento de moedas para símbolos
const currencyToSymbol: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

// Mapeamento de moedas para localização
const currencyToLocale: Record<string, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

/**
 * Hook para formatar moeda baseada no idioma atual
 */
export function useCurrencyFormatter() {
  const { i18n, t } = useTranslation();

  const getCurrencyForLanguage = (language: string): string => {
    return languageToCurrency[language] || "USD";
  };

  const getCurrentCurrency = (): string => {
    const currentLang = i18n.language;
    return getCurrencyForLanguage(currentLang);
  };

  const formatCurrency = (amount: number, currency?: string): string => {
    const targetCurrency = currency || getCurrentCurrency();
    const locale = currencyToLocale[targetCurrency] || "en-US";

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback para formatação simples
      const symbol = currencyToSymbol[targetCurrency] || targetCurrency;
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

  const getCurrencySymbol = (currency?: string): string => {
    const targetCurrency = currency || getCurrentCurrency();
    return currencyToSymbol[targetCurrency] || targetCurrency;
  };

  const getCurrencyName = (currency?: string): string => {
    const targetCurrency = currency || getCurrentCurrency();
    const currencyKey = `currency.name.${targetCurrency.toLowerCase()}`;
    return t(currencyKey, targetCurrency); // Fallback to currency code if translation not found
  };

  const formatCurrencyWithName = (amount: number, currency?: string): string => {
    const targetCurrency = currency || getCurrentCurrency();
    const formattedAmount = formatCurrency(amount, targetCurrency);
    const currencyName = getCurrencyName(targetCurrency);
    return `${formattedAmount} ${currencyName}`;
  };

  return {
    getCurrentCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyName,
    formatCurrencyWithName,
    getCurrencyForLanguage,
  };
}

/**
 * Função utilitária para formatar moeda sem hook (para uso em componentes não-React)
 */
export function formatCurrencyByLanguage(
  amount: number,
  language: string,
  currency?: string,
): string {
  const targetCurrency = currency || languageToCurrency[language] || "USD";
  const locale = currencyToLocale[targetCurrency] || "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback para formatação simples
    const symbol = currencyToSymbol[targetCurrency] || targetCurrency;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Função utilitária para obter nome da moeda sem hook
 */
export function getCurrencyNameByLanguage(
  currency: string,
  language: string,
): string {
  // Mapeamento direto para nomes de moeda por idioma
  const currencyNameMap: Record<string, Record<string, string>> = {
    pt: {
      brl: "reais",
      usd: "dólares",
      eur: "euros",
      gbp: "libras",
    },
    en: {
      brl: "reais",
      usd: "dollars",
      eur: "euros",
      gbp: "pounds",
    },
  };

  const lang = language.startsWith("pt") ? "pt" : "en";
  const currencyLower = currency.toLowerCase();
  
  return currencyNameMap[lang]?.[currencyLower] || currency;
}

/**
 * Função utilitária para formatar moeda com nome sem hook
 */
export function formatCurrencyWithNameByLanguage(
  amount: number,
  language: string,
  currency?: string,
): string {
  const targetCurrency = currency || languageToCurrency[language] || "USD";
  const formattedAmount = formatCurrencyByLanguage(amount, language, targetCurrency);
  const currencyName = getCurrencyNameByLanguage(targetCurrency, language);
  return `${formattedAmount} ${currencyName}`;
}
