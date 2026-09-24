import { and, asc, count, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { badRequest, conflict, notFound } from "../../lib/errors.js";
import { decryptCredentials, encryptCredentials } from "../../lib/crypto.js";
import { env } from "../../lib/env.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
import { getPaymentAdapter, isConfigured, listPaymentAdapters, } from "../../integrations/payment/registry.js";
import { getShippingAdapter, listShippingAdapters } from "../../integrations/shipping/registry.js";
/**
 * Module « Agrégateurs » (§2.5, §4.6).
 *
 * La configuration en base et le comportement en code sont volontairement
 * séparés : la table décrit *quelles clés* et *quel environnement*, le
 * registre décrit *comment parler au prestataire*. L'écran du panel se
 * construit à partir du registre, ce qui rend un nouvel agrégateur visible
 * sans aucune modification de l'interface.
 *
 * Les secrets ne quittent jamais le serveur en clair : la lecture renvoie la
 * liste des clés renseignées, jamais leur valeur.
 */
const toProviderConfig = (row, adapter) => {
    const configuredKeys = Object.keys(row.credentials);
    return {
        id: row.id,
        key: row.key,
        name: adapter.name,
        description: adapter.description,
        logoUrl: adapter.logoUrl,
        isEnabled: row.isEnabled,
        environment: row.environment,
        config: row.config,
        position: row.position,
        requiredCredentials: adapter.requiredCredentials,
        configuredKeys,
        isConfigured: adapter.requiredCredentials
            .filter((field) => field.secret)
            .every((field) => configuredKeys.includes(field.key)),
        supportsWebhooks: adapter.supportsWebhooks,
        webhookUrl: adapter.supportsWebhooks
            ? `${env.PUBLIC_API_URL}/api/webhooks/${row.key}`
            : null,
        updatedAt: row.updatedAt.toISOString(),
    };
};
export const listPaymentProviders = async () => {
    const rows = await db
        .select()
        .from(t.paymentProviders)
        .orderBy(asc(t.paymentProviders.position));
    const known = new Map(rows.map((row) => [row.key, row]));
    // La liste est pilotée par le registre : un adaptateur ajouté au code
    // apparaît dans le panel même s'il n'a pas encore de ligne en base.
    return listPaymentAdapters().map((adapter) => {
        const row = known.get(adapter.key);
        return toProviderConfig(row ?? {
            id: "00000000-0000-0000-0000-000000000000",
            key: adapter.key,
            isEnabled: false,
            environment: "test",
            credentials: {},
            config: {},
            position: 99,
            updatedAt: new Date(),
        }, adapter);
    });
};
export const listShippingProviders = async () => {
    const rows = await db
        .select()
        .from(t.shippingProviders)
        .orderBy(asc(t.shippingProviders.position));
    const known = new Map(rows.map((row) => [row.key, row]));
    return listShippingAdapters().map((adapter) => toProviderConfig(known.get(adapter.key) ?? {
        id: "00000000-0000-0000-0000-000000000000",
        key: adapter.key,
        isEnabled: false,
        environment: "test",
        credentials: {},
        config: {},
        position: 99,
        updatedAt: new Date(),
    }, { ...adapter, supportsWebhooks: false }));
};
/**
 * Met à jour la configuration d'un agrégateur.
 *
 * Deux garde-fous :
 *   - les clés fournies sont chiffrées et **fusionnées** avec l'existant, pour
 *     qu'un formulaire renvoyé sans les secrets ne les efface pas ;
 *   - l'activation est refusée tant qu'une clé obligatoire manque, sinon les
 *     paiements échoueraient silencieusement en production.
 */
export const updatePaymentProvider = async (key, input) => {
    const adapter = getPaymentAdapter(key);
    if (!adapter)
        throw notFound("Agrégateur de paiement");
    const [existing] = await db
        .select()
        .from(t.paymentProviders)
        .where(eq(t.paymentProviders.key, key))
        .limit(1);
    // Une valeur vide efface la clé ; une clé absente du formulaire la conserve.
    const mergedCredentials = { ...(existing?.credentials ?? {}) };
    if (input.credentials) {
        for (const [name, value] of Object.entries(input.credentials)) {
            if (value === "")
                delete mergedCredentials[name];
            else
                Object.assign(mergedCredentials, encryptCredentials({ [name]: value }));
        }
    }
    const willEnable = input.isEnabled ?? existing?.isEnabled ?? false;
    if (willEnable && !isConfigured(adapter, mergedCredentials)) {
        const missing = adapter.requiredCredentials
            .filter((field) => field.secret && !mergedCredentials[field.key])
            .map((field) => field.label);
        throw conflict(`Impossible d'activer « ${adapter.name} » : ${missing.join(", ")} manquant(s).`, { credentials: missing });
    }
    const values = {
        key,
        name: adapter.name,
        description: adapter.description,
        isEnabled: willEnable,
        environment: input.environment ?? existing?.environment ?? "test",
        credentials: mergedCredentials,
        config: input.config ?? existing?.config ?? {},
        position: input.position ?? existing?.position ?? 0,
        updatedAt: new Date(),
    };
    await db
        .insert(t.paymentProviders)
        .values(values)
        .onConflictDoUpdate({ target: t.paymentProviders.key, set: values });
    const providers = await listPaymentProviders();
    return providers.find((provider) => provider.key === key);
};
export const updateShippingProvider = async (key, input) => {
    const adapter = getShippingAdapter(key);
    if (!adapter)
        throw notFound("Agrégateur de livraison");
    const [existing] = await db
        .select()
        .from(t.shippingProviders)
        .where(eq(t.shippingProviders.key, key))
        .limit(1);
    const mergedCredentials = { ...(existing?.credentials ?? {}) };
    if (input.credentials) {
        for (const [name, value] of Object.entries(input.credentials)) {
            if (value === "")
                delete mergedCredentials[name];
            else
                Object.assign(mergedCredentials, encryptCredentials({ [name]: value }));
        }
    }
    const values = {
        key,
        name: adapter.name,
        description: adapter.description,
        isEnabled: input.isEnabled ?? existing?.isEnabled ?? false,
        environment: input.environment ?? existing?.environment ?? "test",
        credentials: mergedCredentials,
        config: input.config ?? existing?.config ?? {},
        supportsLabels: adapter.supportsLabels,
        position: input.position ?? existing?.position ?? 0,
        updatedAt: new Date(),
    };
    await db
        .insert(t.shippingProviders)
        .values(values)
        .onConflictDoUpdate({ target: t.shippingProviders.key, set: values });
    const providers = await listShippingProviders();
    return providers.find((provider) => provider.key === key);
};
/** Vérifie la configuration avant activation, depuis le panel. */
export const testPaymentProvider = async (key) => {
    const adapter = getPaymentAdapter(key);
    if (!adapter)
        throw notFound("Agrégateur de paiement");
    if (!adapter.test) {
        return { ok: true, message: "Cet agrégateur ne propose pas de test de connexion." };
    }
    const [row] = await db
        .select()
        .from(t.paymentProviders)
        .where(eq(t.paymentProviders.key, key))
        .limit(1);
    return adapter.test({
        environment: row?.environment ?? "test",
        credentials: decryptCredentials(row?.credentials ?? {}),
        config: row?.config ?? {},
    });
};
/** Moyens de paiement proposés au storefront - sans aucune clé. */
export const listAvailablePaymentOptions = async () => {
    const rows = await db
        .select({
        key: t.paymentProviders.key,
        credentials: t.paymentProviders.credentials,
    })
        .from(t.paymentProviders)
        .where(eq(t.paymentProviders.isEnabled, true))
        .orderBy(asc(t.paymentProviders.position));
    return rows.flatMap((row) => {
        const adapter = getPaymentAdapter(row.key);
        // Un agrégateur activé mais incomplètement configuré n'est pas proposé :
        // mieux vaut une option absente qu'un paiement qui échoue au clic.
        if (!adapter || !isConfigured(adapter, row.credentials))
            return [];
        return [
            {
                key: adapter.key,
                name: adapter.name,
                description: adapter.description,
                logoUrl: adapter.logoUrl,
            },
        ];
    });
};
// --- Zones et tarifs de livraison ------------------------------------------
export const listShippingZones = async () => {
    const [zones, rates] = await Promise.all([
        db.select().from(t.shippingZones).orderBy(asc(t.shippingZones.name)),
        db.select().from(t.shippingRates).orderBy(asc(t.shippingRates.position)),
    ]);
    return zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        countryCodes: zone.countryCodes,
        isActive: zone.isActive,
        createdAt: zone.createdAt.toISOString(),
        rates: rates
            .filter((rate) => rate.zoneId === zone.id)
            .map((rate) => ({
            id: rate.id,
            zoneId: rate.zoneId,
            zoneName: zone.name,
            providerKey: rate.providerKey,
            name: rate.name,
            kind: rate.kind,
            amount: rate.amount,
            currency: rate.currency,
            minWeightGrams: rate.minWeightGrams,
            maxWeightGrams: rate.maxWeightGrams,
            freeAboveTotal: rate.freeAboveTotal,
            estimatedDaysMin: rate.estimatedDaysMin,
            estimatedDaysMax: rate.estimatedDaysMax,
            isActive: rate.isActive,
            position: rate.position,
        })),
    }));
};
export const createShippingZone = async (input) => {
    const [created] = await db.insert(t.shippingZones).values(input).returning();
    return {
        id: created.id,
        name: created.name,
        countryCodes: created.countryCodes,
        isActive: created.isActive,
        createdAt: created.createdAt.toISOString(),
    };
};
export const updateShippingZone = async (id, input) => {
    const patch = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
    const [updated] = await db
        .update(t.shippingZones)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(t.shippingZones.id, id))
        .returning();
    if (!updated)
        throw notFound("Zone de livraison");
    return {
        id: updated.id,
        name: updated.name,
        countryCodes: updated.countryCodes,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
    };
};
export const deleteShippingZone = async (id) => {
    const [deleted] = await db
        .delete(t.shippingZones)
        .where(eq(t.shippingZones.id, id))
        .returning({ id: t.shippingZones.id });
    if (!deleted)
        throw notFound("Zone de livraison");
};
export const createShippingRate = async (input) => {
    if (!getShippingAdapter(input.providerKey)) {
        throw badRequest("Transporteur inconnu.", { providerKey: ["Aucun adaptateur enregistré."] });
    }
    const [created] = await db
        .insert(t.shippingRates)
        .values({
        zoneId: input.zoneId,
        providerKey: input.providerKey,
        name: input.name,
        kind: input.kind,
        amount: input.amount,
        currency: input.currency,
        minWeightGrams: input.minWeightGrams ?? null,
        maxWeightGrams: input.maxWeightGrams ?? null,
        freeAboveTotal: input.freeAboveTotal ?? null,
        estimatedDaysMin: input.estimatedDaysMin ?? null,
        estimatedDaysMax: input.estimatedDaysMax ?? null,
        isActive: input.isActive,
        position: input.position,
    })
        .returning();
    return { ...created, zoneName: undefined };
};
export const updateShippingRate = async (id, input) => {
    const patch = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
    const [updated] = await db
        .update(t.shippingRates)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(t.shippingRates.id, id))
        .returning();
    if (!updated)
        throw notFound("Tarif de livraison");
    return updated;
};
export const deleteShippingRate = async (id) => {
    const [deleted] = await db
        .delete(t.shippingRates)
        .where(eq(t.shippingRates.id, id))
        .returning({ id: t.shippingRates.id });
    if (!deleted)
        throw notFound("Tarif de livraison");
};
// --- Journal des transactions (§2.5) ---------------------------------------
export const listTransactions = async (query) => {
    const filters = [];
    if (query.orderId)
        filters.push(eq(t.transactions.orderId, query.orderId));
    if (query.providerKey)
        filters.push(eq(t.transactions.providerKey, query.providerKey));
    if (query.kind)
        filters.push(eq(t.transactions.kind, query.kind));
    if (query.status)
        filters.push(eq(t.transactions.status, query.status));
    if (query.from)
        filters.push(gte(t.transactions.createdAt, new Date(query.from)));
    if (query.to)
        filters.push(lte(t.transactions.createdAt, new Date(query.to)));
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = toSqlPagination(query);
    const [rows, [totals]] = await Promise.all([
        db
            .select({
            id: t.transactions.id,
            orderId: t.transactions.orderId,
            orderDisplayId: t.orders.displayId,
            providerKey: t.transactions.providerKey,
            providerTransactionId: t.transactions.providerTransactionId,
            kind: t.transactions.kind,
            status: t.transactions.status,
            amount: t.transactions.amount,
            currency: t.transactions.currency,
            errorMessage: t.transactions.errorMessage,
            createdAt: t.transactions.createdAt,
            updatedAt: t.transactions.updatedAt,
        })
            .from(t.transactions)
            .innerJoin(t.orders, eq(t.orders.id, t.transactions.orderId))
            .where(where)
            .orderBy(desc(t.transactions.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ total: count() }).from(t.transactions).where(where),
    ]);
    return paginate(rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    })), query, totals?.total ?? 0);
};
//# sourceMappingURL=service.js.map