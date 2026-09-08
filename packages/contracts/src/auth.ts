import { z } from "zod";
import { ROLE_KEYS, USER_KINDS, USER_STATUSES } from "./enums.js";
import { emailSchema, paginationQuerySchema, uuidSchema } from "./common.js";

/**
 * Politique de mot de passe. Volontairement basée sur la longueur plutôt que
 * sur des classes de caractères exotiques : plus efficace et plus utilisable.
 */
export const passwordSchema = z
	.string()
	.min(10, "Le mot de passe doit contenir au moins 10 caractères.")
	.max(200)
	.regex(/[a-z]/, "Le mot de passe doit contenir une minuscule.")
	.regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule.")
	.regex(/[0-9]/, "Le mot de passe doit contenir un chiffre.");

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Mot de passe requis."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().min(1).max(80),
	phone: z.string().trim().max(32).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshSchema = z.object({
	/** Optionnel : le refresh token arrive normalement par cookie httpOnly. */
	refreshToken: z.string().min(1).optional(),
});

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: passwordSchema,
});

export const requestPasswordResetSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
	token: z.string().min(1),
	password: passwordSchema,
});

// --- Utilisateurs ----------------------------------------------------------

export const addressSchema = z.object({
	id: uuidSchema,
	firstName: z.string(),
	lastName: z.string(),
	company: z.string().nullable(),
	address1: z.string(),
	address2: z.string().nullable(),
	city: z.string(),
	postalCode: z.string().nullable(),
	province: z.string().nullable(),
	countryCode: z.string(),
	phone: z.string().nullable(),
	isDefaultShipping: z.boolean(),
	isDefaultBilling: z.boolean(),
});

export type Address = z.infer<typeof addressSchema>;

export const addressInputSchema = z.object({
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().min(1).max(80),
	company: z.string().trim().max(120).nullish(),
	address1: z.string().trim().min(1).max(255),
	address2: z.string().trim().max(255).nullish(),
	city: z.string().trim().min(1).max(120),
	postalCode: z.string().trim().max(20).nullish(),
	province: z.string().trim().max(120).nullish(),
	/** ISO 3166-1 alpha-2, minuscules (`ci`, `fr`). */
	countryCode: z.string().trim().toLowerCase().length(2),
	phone: z.string().trim().max(32).nullish(),
	isDefaultShipping: z.boolean().default(false),
	isDefaultBilling: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

export const userSchema = z.object({
	id: uuidSchema,
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().nullable(),
	kind: z.enum(USER_KINDS),
	status: z.enum(USER_STATUSES),
	roles: z.array(z.enum(ROLE_KEYS)),
	permissions: z.array(z.string()),
	lastLoginAt: z.string().nullable(),
	createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
	user: userSchema,
	accessToken: z.string(),
	/** Durée de vie du token d'accès, en secondes. */
	expiresIn: z.number().int(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

/** Charge utile du JWT. Les permissions y sont inlinées pour éviter un aller-retour base à chaque requête. */
export interface JwtPayload {
	sub: string;
	email: string;
	kind: (typeof USER_KINDS)[number];
	roles: string[];
	permissions: string[];
	exp: number;
	iat: number;
}

// --- Administration des comptes back-office --------------------------------

export const createStaffSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().min(1).max(80),
	phone: z.string().trim().max(32).nullish(),
	roles: z.array(z.enum(ROLE_KEYS)).min(1, "Au moins un rôle est requis."),
	status: z.enum(USER_STATUSES).default("active"),
});

export const updateStaffSchema = createStaffSchema
	.partial()
	.omit({ password: true });

export const updateProfileSchema = z.object({
	firstName: z.string().trim().min(1).max(80).optional(),
	lastName: z.string().trim().min(1).max(80).optional(),
	phone: z.string().trim().max(32).nullish(),
});

export const userListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	kind: z.enum(USER_KINDS).optional(),
	status: z.enum(USER_STATUSES).optional(),
	role: z.enum(ROLE_KEYS).optional(),
});

// --- Journal d'activité ----------------------------------------------------

export const auditLogSchema = z.object({
	id: uuidSchema,
	userId: uuidSchema.nullable(),
	userName: z.string().nullable(),
	action: z.string(),
	resourceType: z.string(),
	resourceId: z.string().nullable(),
	changes: z.record(z.string(), z.unknown()).nullable(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	createdAt: z.string(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

export const auditLogListQuerySchema = paginationQuerySchema.extend({
	userId: uuidSchema.optional(),
	action: z.string().max(120).optional(),
	resourceType: z.string().max(120).optional(),
	resourceId: z.string().max(120).optional(),
	from: z.iso.datetime().optional(),
	to: z.iso.datetime().optional(),
});
