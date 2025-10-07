import { 
  I18nString, 
  I18nContext, 
  SupportedLanguage, 
  SupportedCurrency,
  Price 
} from '../schemas/i18n.schema';

/**
 * Taux de change XOF vers autres devises
 * En production, ces taux seraient récupérés d'une API externe
 */
const EXCHANGE_RATES = {
  XOF: 1,
  USD: 0.0016, // 1 XOF = 0.0016 USD (exemple)
};

/**
 * Extrait la chaîne dans la langue demandée
 */
export function extractI18nString(
  i18nString: I18nString,
  language: SupportedLanguage,
): string {
  return i18nString[language] || i18nString.fr || i18nString.en || '';
}

/**
 * Convertit un prix vers la devise demandée
 */
export function convertPrice(
  price: Price,
  targetCurrency: SupportedCurrency,
): { amount: number; currency: string } {
  if (!price || price.currency !== 'XOF') {
    throw new Error('Prix invalide ou devise source incorrecte');
  }

  const rate = EXCHANGE_RATES[targetCurrency];
  if (!rate) {
    throw new Error(`Devise non supportée: ${targetCurrency}`);
  }

  return {
    amount: Math.round(price.amount * rate * 100) / 100, // Arrondi à 2 décimales
    currency: targetCurrency,
  };
}

/**
 * Crée une projection MongoDB pour récupérer uniquement les champs dans la langue demandée
 */
export function createI18nProjection(
  fields: string[],
  context: I18nContext,
): Record<string, any> {
  const projection: Record<string, any> = {};

  fields.forEach((field) => {
    // Pour les champs i18n, projette seulement la langue demandée
    projection[`${field}.${context.language}`] = 1;
    
    // Fallback vers français si la langue demandée n'existe pas
    if (context.language !== SupportedLanguage.FR) {
      projection[`${field}.fr`] = 1;
    }
  });

  return projection;
}

/**
 * Transforme un document avec des champs i18n pour retourner seulement la langue demandée
 */
export function transformI18nDocument(
  document: any,
  i18nFields: string[],
  context: I18nContext,
): any {
  if (!document) return document;

  const transformed = { ...document };

  i18nFields.forEach((field) => {
    if (transformed[field] && typeof transformed[field] === 'object') {
      const i18nValue = transformed[field];
      // Utilise la langue demandée ou fallback vers français
      transformed[field] = 
        i18nValue[context.language] || 
        i18nValue.fr || 
        i18nValue.en || 
        '';
    }
  });

  return transformed;
}

/**
 * Transforme un document avec des prix pour la devise demandée
 */
export function transformPriceDocument(
  document: any,
  priceFields: string[],
  targetCurrency: SupportedCurrency,
): any {
  if (!document || targetCurrency === SupportedCurrency.XOF) {
    return document;
  }

  const transformed = { ...document };

  priceFields.forEach((field) => {
    if (transformed[field] && transformed[field].amount !== undefined) {
      try {
        transformed[field] = convertPrice(transformed[field], targetCurrency);
      } catch (error) {
        console.warn(`Erreur conversion prix pour ${field}:`, error.message);
      }
    }
  });

  return transformed;
}

/**
 * Utilitaire pour extraire le contexte i18n des headers HTTP
 */
export function extractI18nContext(headers: Record<string, string>): I18nContext {
  // Extrait la langue depuis Accept-Language
  const acceptLanguage = headers['accept-language'] || headers['Accept-Language'] || 'fr';
  let language = SupportedLanguage.FR;
  
  if (acceptLanguage.includes('en')) {
    language = SupportedLanguage.EN;
  }

  // Extrait la devise depuis Accept-Currency
  const acceptCurrency = headers['accept-currency'] || headers['Accept-Currency'] || 'XOF';
  let currency = SupportedCurrency.XOF;
  
  if (acceptCurrency.includes('USD')) {
    currency = SupportedCurrency.USD;
  }

  return { language, currency };
}

/**
 * Pipeline MongoDB pour la transformation i18n et prix
 */
export function createI18nPipeline(
  context: I18nContext,
  i18nFields: string[] = [],
  priceFields: string[] = [],
): any[] {
  const pipeline: any[] = [];

  // Étape 1: Projection pour les champs i18n
  if (i18nFields.length > 0) {
    const projection: Record<string, any> = {};
    
    i18nFields.forEach((field) => {
      projection[field] = {
        $ifNull: [
          `$${field}.${context.language}`,
          `$${field}.fr`
        ]
      };
    });

    pipeline.push({ $addFields: projection });
  }

  // Étape 2: Conversion des prix si nécessaire
  if (context.currency !== SupportedCurrency.XOF && priceFields.length > 0) {
    const rate = EXCHANGE_RATES[context.currency];
    const priceProjection: Record<string, any> = {};

    priceFields.forEach((field) => {
      priceProjection[field] = {
        amount: {
          $round: [{
            $multiply: [`$${field}.amount`, rate]
          }, 2]
        },
        currency: context.currency
      };
    });

    pipeline.push({ $addFields: priceProjection });
  }

  return pipeline;
}
