import type {
	Paginated,
	PromoCode,
	PromoCodeInput,
	PromoCodeListQuery,
	UpdatePromoCodeInput,
} from "@prettyfull/contracts";
import { and, count, desc, eq, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db, type Transaction } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { badRequest, conflict, notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";

const toPromoCode = (row: typeof t.promoCodes.$inferSelect): PromoCode => ({
	id: row.id,
	code: row.code,
	description: row.description,
	discountType: row.discountType,
	discountValue: row.discountValue,
	minOrderAmount: row.minOrderAmount,
	maxDiscountAmount: row.maxDiscountAmount,
	usageLimit: row.usageLimit,
	usageCount: row.usageCount,
	status: row.status,
	startsAt: row.startsAt?.toISOString() ?? null,
	endsAt: row.endsAt?.toISOString() ?? null,
	createdAt: row.createdAt.toISOString(),
	updatedAt: row.updatedAt.toISOString(),
});

const assertCodeAvailable = async (code: string, excludeId?: string): Promise<void> => {
	const [existing] = await db
		.select({ id: t.promoCodes.id })
		.from(t.promoCodes)
		.where(eq(t.promoCodes.code, code))
		.limit(1);

	if (existing && existing.id !== excludeId) {
		throw conflict("Ce code est déjà utilisé par un autre code promo.", {
			code: ["Code déjà pris."],
		});
	}
};

// --- Lecture / écriture (admin) ---------------------------------------------

export const listPromoCodes = async (
	query: PromoCodeListQuery,
): Promise<Paginated<PromoCode>> => {
	const filters: SQL[] = [];

	if (query.status) filters.push(eq(t.promoCodes.status, query.status));
	if (query.q) {
		filters.push(sql`(
			${t.promoCodes.code} ilike ${`%${query.q}%`}
			or ${t.promoCodes.description} ilike ${`%${query.q}%`}
		)`);
	}

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.promoCodes)
			.where(where)
			.orderBy(desc(t.promoCodes.createdAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.promoCodes).where(where),
	]);

	return paginate(rows.map(toPromoCode), query, totals?.total ?? 0);
};

export const getPromoCode = async (id: string): Promise<PromoCode> => {
	const [row] = await db.select().from(t.promoCodes).where(eq(t.promoCodes.id, id)).limit(1);
	if (!row) throw notFound("Code promo");
	return toPromoCode(row);
};

export const createPromoCode = async (input: PromoCodeInput): Promise<PromoCode> => {
	await assertCodeAvailable(input.code);

	const [created] = await db
		.insert(t.promoCodes)
		.values({
			code: input.code,
			description: input.description ?? null,
			discountType: input.discountType,
			discountValue: input.discountValue,
			minOrderAmount: input.minOrderAmount ?? null,
			maxDiscountAmount: input.maxDiscountAmount ?? null,
			usageLimit: input.usageLimit ?? null,
			status: input.status,
			startsAt: input.startsAt ? new Date(input.startsAt) : null,
			endsAt: input.endsAt ? new Date(input.endsAt) : null,
		})
		.returning();

	return toPromoCode(created!);
};

export const updatePromoCode = async (
	id: string,
	input: UpdatePromoCodeInput,
): Promise<PromoCode> => {
	if (input.code) await assertCodeAvailable(input.code, id);

	const { startsAt, endsAt, ...fields } = input;

	const [current] = await db
		.select({ startsAt: t.promoCodes.startsAt, endsAt: t.promoCodes.endsAt })
		.from(t.promoCodes)
		.where(eq(t.promoCodes.id, id))
		.limit(1);

	if (!current) throw notFound("Code promo");

	// Fenêtre revalidée après fusion : la contrainte `promo_codes_schedule_order`
	// existe en base, mais la laisser échouer produirait une 500 illisible.
	const nextStart = startsAt !== undefined ? (startsAt ? new Date(startsAt) : null) : current.startsAt;
	const nextEnd = endsAt !== undefined ? (endsAt ? new Date(endsAt) : null) : current.endsAt;

	if (nextStart && nextEnd && nextEnd <= nextStart) {
		throw conflict("La date de fin doit être postérieure à la date de début.", {
			endsAt: ["Doit suivre la date de début."],
		});
	}

	const [updated] = await db
		.update(t.promoCodes)
		.set({
			...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
			startsAt: nextStart,
			endsAt: nextEnd,
			updatedAt: new Date(),
		})
		.where(eq(t.promoCodes.id, id))
		.returning();

	if (!updated) throw notFound("Code promo");
	return toPromoCode(updated);
};

export const deletePromoCode = async (id: string): Promise<void> => {
	const [deleted] = await db
		.delete(t.promoCodes)
		.where(eq(t.promoCodes.id, id))
		.returning({ id: t.promoCodes.id });

	if (!deleted) throw notFound("Code promo");
};

// --- Application au panier / à la commande ----------------------------------

export interface ResolvedDiscount {
	promoCodeId: string;
	code: string;
	amount: number;
}

/** Remise brute, plafonnée par `maxDiscountAmount` puis par le sous-total lui-même. */
const computeDiscountAmount = (
	promo: {
		discountType: "percentage" | "fixed";
		discountValue: number;
		maxDiscountAmount: number | null;
	},
	subtotal: number,
): number => {
	const raw =
		promo.discountType === "percentage"
			? Math.round((subtotal * promo.discountValue) / 100)
			: promo.discountValue;

	const capped = promo.maxDiscountAmount != null ? Math.min(raw, promo.maxDiscountAmount) : raw;

	return Math.max(0, Math.min(capped, subtotal));
};

/**
 * Valide un code pour un sous-total donné et renvoie la remise calculée.
 *
 * Appelée à l'application au panier ET revalidée au passage en commande
 * (§2.9) : un code peut expirer ou atteindre sa limite entre les deux sans
 * qu'aucune des deux étapes ne le sache à l'avance.
 */
export const resolveDiscountForSubtotal = async (
	code: string,
	subtotal: number,
): Promise<ResolvedDiscount> => {
	const normalized = code.trim().toUpperCase();

	const [promo] = await db
		.select()
		.from(t.promoCodes)
		.where(eq(t.promoCodes.code, normalized))
		.limit(1);

	if (!promo) {
		throw badRequest("Ce code promo n'existe pas.", { code: ["Code invalide."] });
	}
	if (promo.status !== "active") {
		throw badRequest("Ce code promo n'est plus actif.", { code: ["Code inactif."] });
	}

	const now = new Date();
	if (promo.startsAt && now < promo.startsAt) {
		throw badRequest("Ce code promo n'est pas encore disponible.", {
			code: ["Pas encore actif."],
		});
	}
	if (promo.endsAt && now > promo.endsAt) {
		throw badRequest("Ce code promo a expiré.", { code: ["Code expiré."] });
	}
	if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) {
		throw badRequest("Ce code promo a atteint sa limite d'utilisation.", {
			code: ["Limite atteinte."],
		});
	}
	if (promo.minOrderAmount != null && subtotal < promo.minOrderAmount) {
		throw badRequest(
			`Ce code promo s'applique à partir de ${promo.minOrderAmount} dans la devise du panier.`,
			{ code: ["Montant minimum non atteint."] },
		);
	}

	return {
		promoCodeId: promo.id,
		code: promo.code,
		amount: computeDiscountAmount(promo, subtotal),
	};
};

/**
 * Remise d'un code déjà appliqué à un panier, pour l'affichage (`getCart`).
 *
 * Contrairement à `resolveDiscountForSubtotal`, ne lève jamais : un code qui
 * a expiré ou atteint sa limite depuis son application doit juste disparaître
 * du récapitulatif, pas faire échouer la lecture du panier.
 */
export const getAppliedDiscount = async (
	promoCodeId: string,
	subtotal: number,
): Promise<ResolvedDiscount | null> => {
	const [promo] = await db
		.select()
		.from(t.promoCodes)
		.where(eq(t.promoCodes.id, promoCodeId))
		.limit(1);

	if (!promo || promo.status !== "active") return null;

	const now = new Date();
	if (promo.startsAt && now < promo.startsAt) return null;
	if (promo.endsAt && now > promo.endsAt) return null;
	if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) return null;
	if (promo.minOrderAmount != null && subtotal < promo.minOrderAmount) return null;

	return {
		promoCodeId: promo.id,
		code: promo.code,
		amount: computeDiscountAmount(promo, subtotal),
	};
};

/** Incrément atomique - jamais un recalcul depuis l'historique des commandes. */
export const incrementUsage = async (
	id: string,
	executor: Transaction | typeof db = db,
): Promise<void> => {
	await executor
		.update(t.promoCodes)
		.set({ usageCount: sql`${t.promoCodes.usageCount} + 1`, updatedAt: new Date() })
		.where(eq(t.promoCodes.id, id));
};
