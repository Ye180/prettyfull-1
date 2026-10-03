import { check, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { activationStatusEnum, discountTypeEnum } from "./enums.js";
/**
 * Code promo (§2.9) : remise en pourcentage ou en montant fixe, appliquée au
 * panier puis figée sur la commande (§2.4 « snapshot »).
 *
 * `usageCount` est incrémenté de façon atomique au passage en commande
 * (jamais recalculé depuis l'historique) : c'est le seul compteur fiable sous
 * concurrence sans verrouiller la table entière.
 */
export const promoCodes = pgTable("promo_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 40 }).notNull(),
    description: text("description"),
    discountType: discountTypeEnum("discount_type").notNull(),
    /** Pourcentage (1-100) ou montant fixe dans la plus petite unité monétaire. */
    discountValue: integer("discount_value").notNull(),
    minOrderAmount: integer("min_order_amount"),
    maxDiscountAmount: integer("max_discount_amount"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    status: activationStatusEnum("status").notNull().default("active"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    uniqueIndex("promo_codes_code_unique").on(table.code),
    index("promo_codes_status_idx").on(table.status),
    check("promo_codes_value_positive", sql `${table.discountValue} > 0`),
    check("promo_codes_percentage_range", sql `${table.discountType} <> 'percentage' or ${table.discountValue} <= 100`),
    check("promo_codes_schedule_order", sql `${table.startsAt} is null or ${table.endsAt} is null or ${table.endsAt} > ${table.startsAt}`),
]);
//# sourceMappingURL=promotions.js.map