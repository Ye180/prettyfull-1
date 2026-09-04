import type { CurrencyCode } from "@prettyfull/contracts";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import * as t from "../../../db/schema/index.js";
import type { ShippingAdapter, ShippingQuote } from "../types.js";

/**
 * Livraison assurée en interne : les tarifs viennent de la base, pas d'une
 * API tierce.
 *
 * C'est l'adaptateur par défaut. Il implémente les trois modes du §2.5 —
 * montant fixe, tranche de poids, franco de port au-delà d'un seuil — et
 * démontre que le contrat `ShippingAdapter` couvre aussi bien un transporteur
 * externe qu'une grille tarifaire maison.
 */
export const internalShippingAdapter: ShippingAdapter = {
	key: "internal",
	name: "Livraison PrettyFull",
	description: "Tarifs par zone et par poids, gérés depuis le panel.",
	logoUrl: null,
	supportsLabels: false,
	requiredCredentials: [],

	quote: async (context): Promise<ShippingQuote[]> => {
		// La zone est choisie par le pays de destination ; une zone inactive
		// ne propose aucun tarif.
		const rows = await db
			.select({
				id: t.shippingRates.id,
				name: t.shippingRates.name,
				kind: t.shippingRates.kind,
				amount: t.shippingRates.amount,
				currency: t.shippingRates.currency,
				minWeightGrams: t.shippingRates.minWeightGrams,
				maxWeightGrams: t.shippingRates.maxWeightGrams,
				freeAboveTotal: t.shippingRates.freeAboveTotal,
				estimatedDaysMin: t.shippingRates.estimatedDaysMin,
				estimatedDaysMax: t.shippingRates.estimatedDaysMax,
			})
			.from(t.shippingRates)
			.innerJoin(t.shippingZones, eq(t.shippingZones.id, t.shippingRates.zoneId))
			.where(
				and(
					eq(t.shippingRates.isActive, true),
					eq(t.shippingZones.isActive, true),
					eq(t.shippingRates.providerKey, "internal"),
					sql`${context.destination.countryCode} = any(${t.shippingZones.countryCodes})`,
				),
			)
			.orderBy(asc(t.shippingRates.position));

		return rows.flatMap((rate) => {
			// Tranche de poids : le tarif ne s'applique que dans son intervalle.
			if (rate.kind === "weight") {
				const min = rate.minWeightGrams ?? 0;
				const max = rate.maxWeightGrams ?? Number.POSITIVE_INFINITY;
				if (context.weightGrams < min || context.weightGrams > max) return [];
			}

			const free =
				rate.freeAboveTotal !== null && context.subtotal >= rate.freeAboveTotal;

			return [
				{
					rateId: rate.id,
					name: free ? `${rate.name} — offerte` : rate.name,
					amount: free ? 0 : rate.amount,
					currency: rate.currency as CurrencyCode,
					estimatedDaysMin: rate.estimatedDaysMin,
					estimatedDaysMax: rate.estimatedDaysMax,
				},
			];
		});
	},

	test: async () => ({
		ok: true,
		message: "Livraison interne : aucune clé requise, les tarifs sont pilotés depuis le panel.",
	}),
};
