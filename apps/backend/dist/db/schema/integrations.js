import { relations, sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar, } from "drizzle-orm/pg-core";
import { currencyEnum, integrationEnvironmentEnum, shippingRateKindEnum, transactionKindEnum, transactionStatusEnum, } from "./enums.js";
import { orders } from "./orders.js";
/**
 * Configuration d'un agrégateur de paiement (§2.5).
 *
 * La ligne ne décrit que la *configuration* : le comportement vit dans
 * l'adaptateur enregistré sous la même `key` dans le registre. Ajouter un
 * prestataire, c'est écrire un adaptateur et insérer une ligne ici - aucun
 * code du cœur ne change, et l'activation se fait depuis le panel (§7).
 *
 * `credentials` est chiffré au repos par l'application ; l'API ne le renvoie
 * jamais, elle expose seulement la liste des clés renseignées.
 */
export const paymentProviders = pgTable("payment_providers", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    logoUrl: varchar("logo_url", { length: 1000 }),
    isEnabled: boolean("is_enabled").notNull().default(false),
    environment: integrationEnvironmentEnum("environment").notNull().default("test"),
    credentials: jsonb("credentials").$type().notNull().default({}),
    config: jsonb("config").$type().notNull().default({}),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("payment_providers_enabled_idx").on(table.isEnabled, table.position)]);
/** Configuration d'un transporteur / agrégateur de livraison (§2.5). */
export const shippingProviders = pgTable("shipping_providers", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    logoUrl: varchar("logo_url", { length: 1000 }),
    isEnabled: boolean("is_enabled").notNull().default(false),
    environment: integrationEnvironmentEnum("environment").notNull().default("test"),
    credentials: jsonb("credentials").$type().notNull().default({}),
    config: jsonb("config").$type().notNull().default({}),
    /** L'adaptateur sait générer une étiquette d'expédition (§2.5). */
    supportsLabels: boolean("supports_labels").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("shipping_providers_enabled_idx").on(table.isEnabled, table.position)]);
/** Zone de livraison : un ensemble de pays partageant les mêmes tarifs. */
export const shippingZones = pgTable("shipping_zones", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    countryCodes: text("country_codes").array().notNull().default(sql `'{}'::text[]`),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
/**
 * Tarif de port applicable dans une zone (§2.5) : montant fixe, tranche de
 * poids, ou délégation au transporteur (`api`, montant calculé à la volée).
 */
export const shippingRates = pgTable("shipping_rates", {
    id: uuid("id").primaryKey().defaultRandom(),
    zoneId: uuid("zone_id")
        .notNull()
        .references(() => shippingZones.id, { onDelete: "cascade" }),
    providerKey: varchar("provider_key", { length: 64 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    kind: shippingRateKindEnum("kind").notNull().default("flat"),
    amount: integer("amount").notNull().default(0),
    currency: currencyEnum("currency").notNull().default("xof"),
    minWeightGrams: integer("min_weight_grams"),
    maxWeightGrams: integer("max_weight_grams"),
    /** Au-delà de ce sous-total, le port passe à zéro. */
    freeAboveTotal: integer("free_above_total"),
    estimatedDaysMin: integer("estimated_days_min"),
    estimatedDaysMax: integer("estimated_days_max"),
    isActive: boolean("is_active").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("shipping_rates_zone_idx").on(table.zoneId, table.position),
    check("shipping_rates_weight_range", sql `${table.minWeightGrams} is null or ${table.maxWeightGrams} is null or ${table.maxWeightGrams} > ${table.minWeightGrams}`),
]);
/**
 * Journal des transactions (§2.5). Trace chaque tentative de paiement ou de
 * remboursement, avec la requête et la réponse brutes du prestataire - c'est
 * le seul support de preuve lors d'un litige.
 */
export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    providerKey: varchar("provider_key", { length: 64 }).notNull(),
    /** Référence chez le prestataire, utilisée pour rapprocher les webhooks. */
    providerTransactionId: varchar("provider_transaction_id", { length: 255 }),
    kind: transactionKindEnum("kind").notNull().default("payment"),
    status: transactionStatusEnum("status").notNull().default("pending"),
    amount: integer("amount").notNull(),
    currency: currencyEnum("currency").notNull().default("xof"),
    rawRequest: jsonb("raw_request").$type(),
    rawResponse: jsonb("raw_response").$type(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("transactions_order_idx").on(table.orderId),
    index("transactions_provider_idx").on(table.providerKey, table.status),
    index("transactions_created_at_idx").on(table.createdAt),
    uniqueIndex("transactions_provider_ref_unique")
        .on(table.providerKey, table.providerTransactionId)
        .where(sql `${table.providerTransactionId} is not null`),
]);
/**
 * Événements webhook reçus des agrégateurs.
 *
 * `(providerKey, externalId)` est unique : c'est le verrou d'idempotence qui
 * empêche un prestataire rejouant sa notification de confirmer deux fois la
 * même commande et de décrémenter le stock en double.
 */
export const webhookEvents = pgTable("webhook_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    providerKey: varchar("provider_key", { length: 64 }).notNull(),
    eventType: varchar("event_type", { length: 120 }),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    payload: jsonb("payload").$type().notNull(),
    signatureValid: boolean("signature_valid").notNull().default(false),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    uniqueIndex("webhook_events_external_unique").on(table.providerKey, table.externalId),
    index("webhook_events_created_at_idx").on(table.createdAt),
    index("webhook_events_unprocessed_idx")
        .on(table.createdAt)
        .where(sql `${table.processedAt} is null`),
]);
// --- Relations -------------------------------------------------------------
export const shippingZonesRelations = relations(shippingZones, ({ many }) => ({
    rates: many(shippingRates),
}));
export const shippingRatesRelations = relations(shippingRates, ({ one }) => ({
    zone: one(shippingZones, {
        fields: [shippingRates.zoneId],
        references: [shippingZones.id],
    }),
}));
export const transactionsRelations = relations(transactions, ({ one }) => ({
    order: one(orders, { fields: [transactions.orderId], references: [orders.id] }),
}));
//# sourceMappingURL=integrations.js.map