import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { userKindEnum, userStatusEnum } from "./enums.js";

/**
 * Clients et membres du back-office partagent une table : un client peut être
 * promu, et les commandes pointent vers `users` quel que soit le profil.
 * `kind` sépare les deux populations, `deletedAt` assure la suppression
 * logique exigée au §2.1.
 */
export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: varchar("email", { length: 254 }).notNull(),
		passwordHash: text("password_hash").notNull(),
		firstName: varchar("first_name", { length: 80 }).notNull(),
		lastName: varchar("last_name", { length: 80 }).notNull(),
		phone: varchar("phone", { length: 32 }),
		kind: userKindEnum("kind").notNull().default("customer"),
		status: userStatusEnum("status").notNull().default("active"),
		emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
		lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
		/** Préférences d'affichage (langue, devise) mémorisées côté compte. */
		preferences: jsonb("preferences").$type<Record<string, unknown>>(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => [
		// L'unicité porte sur l'email en minuscules : deux comptes ne peuvent pas
		// différer par la seule casse. Un compte supprimé libère son adresse.
		uniqueIndex("users_email_unique")
			.on(sql`lower(${table.email})`)
			.where(sql`${table.deletedAt} is null`),
		index("users_kind_status_idx").on(table.kind, table.status),
		index("users_created_at_idx").on(table.createdAt),
	],
);

export const roles = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	key: varchar("key", { length: 64 }).notNull().unique(),
	name: varchar("name", { length: 120 }).notNull(),
	description: text("description"),
	/** Un rôle système ne peut être ni renommé ni supprimé depuis le panel. */
	isSystem: boolean("is_system").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const permissions = pgTable("permissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	/** Clé `<module>.<action>`, cf. `PERMISSIONS` dans les contrats. */
	key: varchar("key", { length: 96 }).notNull().unique(),
	module: varchar("module", { length: 48 }).notNull(),
	action: varchar("action", { length: 48 }).notNull(),
	description: text("description"),
});

export const rolePermissions = pgTable(
	"role_permissions",
	{
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionId: uuid("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.roleId, table.permissionId] }),
		index("role_permissions_permission_idx").on(table.permissionId),
	],
);

export const userRoles = pgTable(
	"user_roles",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.roleId] }),
		index("user_roles_role_idx").on(table.roleId),
	],
);

/**
 * Refresh tokens à rotation. Seul le hash est stocké : une fuite de la base
 * ne permet pas de rejouer un token. `revokedAt` gère la déconnexion.
 */
export const refreshTokens = pgTable(
	"refresh_tokens",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		revokedAt: timestamp("revoked_at", { withTimezone: true }),
		userAgent: varchar("user_agent", { length: 500 }),
		ipAddress: varchar("ip_address", { length: 64 }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("refresh_tokens_user_idx").on(table.userId),
		index("refresh_tokens_expires_idx").on(table.expiresAt),
	],
);

export const passwordResetTokens = pgTable(
	"password_reset_tokens",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		usedAt: timestamp("used_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("password_reset_user_idx").on(table.userId)],
);

/** Carnet d'adresses client (§2.7). */
export const addresses = pgTable(
	"addresses",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
		firstName: varchar("first_name", { length: 80 }).notNull(),
		lastName: varchar("last_name", { length: 80 }).notNull(),
		company: varchar("company", { length: 120 }),
		address1: varchar("address_1", { length: 255 }).notNull(),
		address2: varchar("address_2", { length: 255 }),
		city: varchar("city", { length: 120 }).notNull(),
		postalCode: varchar("postal_code", { length: 20 }),
		province: varchar("province", { length: 120 }),
		countryCode: varchar("country_code", { length: 2 }).notNull(),
		phone: varchar("phone", { length: 32 }),
		isDefaultShipping: boolean("is_default_shipping").notNull().default(false),
		isDefaultBilling: boolean("is_default_billing").notNull().default(false),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("addresses_user_idx").on(table.userId)],
);

/**
 * Journal d'audit des actions sensibles (§5 « Traçabilité »).
 *
 * `resourceId` est en texte : il accueille aussi bien un UUID qu'une clé
 * fonctionnelle (`wave`, `store_settings`). `userId` passe à NULL si le
 * compte est supprimé — la trace, elle, doit survivre.
 */
export const auditLogs = pgTable(
	"audit_logs",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
		userLabel: varchar("user_label", { length: 200 }),
		action: varchar("action", { length: 120 }).notNull(),
		resourceType: varchar("resource_type", { length: 120 }).notNull(),
		resourceId: varchar("resource_id", { length: 120 }),
		changes: jsonb("changes").$type<Record<string, unknown>>(),
		ipAddress: varchar("ip_address", { length: 64 }),
		userAgent: varchar("user_agent", { length: 500 }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("audit_logs_user_idx").on(table.userId),
		index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
		index("audit_logs_created_at_idx").on(table.createdAt),
	],
);

// --- Relations -------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
	roles: many(userRoles),
	addresses: many(addresses),
	refreshTokens: many(refreshTokens),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
	permissions: many(rolePermissions),
	users: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
	roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
	role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id],
	}),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
	user: one(users, { fields: [userRoles.userId], references: [users.id] }),
	role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
	user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
	user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
	user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
