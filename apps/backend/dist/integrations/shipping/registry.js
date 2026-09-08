import { internalShippingAdapter } from "./providers/internal.js";
/**
 * Registre des agrégateurs de livraison — symétrique du registre paiement.
 * Un transporteur externe (DHL, Chronopost…) s'ajoute ici sans modifier le
 * module Commandes.
 */
const ADAPTERS = [internalShippingAdapter];
const byKey = new Map(ADAPTERS.map((adapter) => [adapter.key, adapter]));
export const listShippingAdapters = () => [...ADAPTERS];
export const getShippingAdapter = (key) => byKey.get(key) ?? null;
//# sourceMappingURL=registry.js.map