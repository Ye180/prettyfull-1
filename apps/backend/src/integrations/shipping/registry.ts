import type { ShippingAdapter } from "./types.js";
import { internalShippingAdapter } from "./providers/internal.js";

/**
 * Registre des agrégateurs de livraison — symétrique du registre paiement.
 * Un transporteur externe (DHL, Chronopost…) s'ajoute ici sans modifier le
 * module Commandes.
 */
const ADAPTERS: ShippingAdapter[] = [internalShippingAdapter];

const byKey = new Map(ADAPTERS.map((adapter) => [adapter.key, adapter]));

export const listShippingAdapters = (): ShippingAdapter[] => [...ADAPTERS];

export const getShippingAdapter = (key: string): ShippingAdapter | null =>
	byKey.get(key) ?? null;
