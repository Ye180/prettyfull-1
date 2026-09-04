import type { PaymentAdapter } from "./types.js";
import { manualAdapter } from "./providers/manual.js";
import { stubAdapter } from "./providers/stub.js";
import { waveAdapter } from "./providers/wave.js";

/**
 * Registre des agrégateurs de paiement.
 *
 * Ajouter un prestataire = écrire un adaptateur et l'ajouter à cette liste.
 * Aucun autre fichier du cœur ne change (§2.5). L'activation, elle, se fait
 * ensuite depuis le panel, sans intervention technique (critère §7).
 */
const ADAPTERS: PaymentAdapter[] = [waveAdapter, manualAdapter, stubAdapter];

const byKey = new Map(ADAPTERS.map((adapter) => [adapter.key, adapter]));

export const listPaymentAdapters = (): PaymentAdapter[] => [...ADAPTERS];

export const getPaymentAdapter = (key: string): PaymentAdapter | null =>
	byKey.get(key) ?? null;

export const hasPaymentAdapter = (key: string): boolean => byKey.has(key);

/**
 * Indique si les clés obligatoires d'un adaptateur sont toutes renseignées.
 *
 * Le panel s'en sert pour empêcher l'activation d'un agrégateur incomplet :
 * activer Wave sans clé API produirait des paiements en échec silencieux.
 */
export const isConfigured = (
	adapter: PaymentAdapter,
	credentials: Record<string, string>,
): boolean =>
	adapter.requiredCredentials
		.filter((field) => field.secret)
		.every((field) => Boolean(credentials[field.key]));
