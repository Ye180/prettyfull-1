import { manualAdapter } from "./providers/manual.js";
import { stripeAdapter } from "./providers/stripe.js";
import { stubAdapter } from "./providers/stub.js";
import { waveAdapter } from "./providers/wave.js";
import { isProduction } from "../../lib/env.js";
import type { CredentialField, PaymentAdapter } from "./types.js";

/**
 * Registre des agrégateurs de paiement.
 *
 * Ajouter un prestataire = écrire un adaptateur et l'ajouter à cette liste.
 * Aucun autre fichier du cœur ne change (§2.5). L'activation, elle, se fait
 * ensuite depuis le panel, sans intervention technique (critère §7).
 */
const ADAPTERS: PaymentAdapter[] = [
  stripeAdapter,
  waveAdapter,
  manualAdapter,
  // Le prestataire fictif accepte des webhooks non signés : présent en
  // production, il permettrait à n'importe qui de marquer une commande payée.
  ...(isProduction ? [] : [stubAdapter]),
];

const byKey = new Map(ADAPTERS.map((adapter) => [adapter.key, adapter]));

export const listPaymentAdapters = (): PaymentAdapter[] => [...ADAPTERS];

export const getPaymentAdapter = (key: string): PaymentAdapter | null =>
  byKey.get(key) ?? null;

export const hasPaymentAdapter = (key: string): boolean => byKey.has(key);

/**
 * Clés effectives d'un prestataire : celles du panel, complétées par les
 * variables d'environnement déclarées sur chaque champ (`field.env`).
 *
 * Appliquée **après** déchiffrement : les valeurs d'environnement sont en
 * clair. Sur des clés encore chiffrées, seule la présence des clés a un sens.
 */
export const resolveCredentials = (
  fields: CredentialField[],
  credentials: Record<string, string>,
): Record<string, string> => {
  const resolved = { ...credentials };
  for (const field of fields) {
    const fallback = field.env ? process.env[field.env] : undefined;
    if (!resolved[field.key] && fallback) resolved[field.key] = fallback;
  }
  return resolved;
};

/**
 * Indique si les clés obligatoires d'un adaptateur sont toutes renseignées.
 *
 * Le panel s'en sert pour empêcher l'activation d'un agrégateur incomplet :
 * activer Wave sans clé API produirait des paiements en échec silencieux.
 */
export const isConfigured = (
  adapter: PaymentAdapter,
  credentials: Record<string, string>,
): boolean => {
  const resolved = resolveCredentials(adapter.requiredCredentials, credentials);
  return adapter.requiredCredentials
    .filter((field) => field.secret && !field.optional)
    .every((field) => Boolean(resolved[field.key]));
};
