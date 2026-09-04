import { relations, sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar, } from "drizzle-orm/pg-core";
import { categories, products } from "./catalog.js";
import { bannerPlacementEnum, contentStatusEnum, featuredKindEnum } from "./enums.js";
import { users } from "./users.js";
/**
 * Bannières et visuels de la page d'accueil (§2.6).
 *
 * `startsAt`/`endsAt` définissent une fenêtre de diffusion : le storefront ne
 * sert que les bannières publiées dont la fenêtre couvre l'instant présent,
 * ce qui permet de programmer une opération commerciale à l'avance.
 */
export const banners = pgTable("banners", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }),
    subtitle: varchar("subtitle", { length: 500 }),
    imageUrl: varchar("image_url", { length: 1000 }).notNull(),
    mobileImageUrl: varchar("mobile_image_url", { length: 1000 }),
    linkUrl: varchar("link_url", { length: 1000 }),
    ctaLabel: varchar("cta_label", { length: 80 }),
    placement: bannerPlacementEnum("placement").notNull().default("home_hero"),
    status: contentStatusEnum("status").notNull().default("draft"),
    position: integer("position").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    translations: jsonb("translations").$type(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("banners_placement_idx").on(table.placement, table.status, table.position),
    check("banners_schedule_order", sql `${table.startsAt} is null or ${table.endsAt} is null or ${table.endsAt} > ${table.startsAt}`),
]);
/** Pages statiques : CGV, à propos, livraison, retours (§2.6). */
export const staticPages = pgTable("static_pages", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    /** Markdown, rendu côté storefront. */
    content: text("content").notNull().default(""),
    excerpt: varchar("excerpt", { length: 1000 }),
    status: contentStatusEnum("status").notNull().default("draft"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: varchar("meta_description", { length: 500 }),
    translations: jsonb("translations").$type(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("static_pages_status_idx").on(table.status)]);
/**
 * Mise en avant d'un produit ou d'une catégorie dans une section nommée de la
 * page d'accueil (§2.6).
 *
 * `sectionKey` reprend les clés déjà utilisées par le storefront
 * (`third_section`, `sixth_section`, …) : le back-office pilote donc les
 * emplacements existants sans refonte du front.
 */
export const featuredEntries = pgTable("featured_entries", {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: featuredKindEnum("kind").notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "cascade",
    }),
    sectionKey: varchar("section_key", { length: 64 }).notNull(),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("featured_entries_section_idx").on(table.sectionKey, table.position),
    uniqueIndex("featured_entries_product_unique")
        .on(table.sectionKey, table.productId)
        .where(sql `${table.productId} is not null`),
    uniqueIndex("featured_entries_category_unique")
        .on(table.sectionKey, table.categoryId)
        .where(sql `${table.categoryId} is not null`),
    // La cible doit correspondre au type déclaré, et une seule être fournie.
    check("featured_entries_target_matches_kind", sql `(${table.kind} = 'product' and ${table.productId} is not null and ${table.categoryId} is null)
			 or (${table.kind} = 'category' and ${table.categoryId} is not null and ${table.productId} is null)`),
]);
// --- Relations -------------------------------------------------------------
export const featuredEntriesRelations = relations(featuredEntries, ({ one }) => ({
    product: one(products, {
        fields: [featuredEntries.productId],
        references: [products.id],
    }),
    category: one(categories, {
        fields: [featuredEntries.categoryId],
        references: [categories.id],
    }),
}));
export const staticPagesRelations = relations(staticPages, ({ one }) => ({
    updatedByUser: one(users, {
        fields: [staticPages.updatedBy],
        references: [users.id],
    }),
}));
//# sourceMappingURL=cms.js.map