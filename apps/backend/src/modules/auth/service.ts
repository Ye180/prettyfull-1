import type {
	AuthResponse,
	JwtPayload,
	LoginInput,
	RegisterInput,
	User,
	UserKind,
} from "@prettyfull/contracts";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { env } from "../../lib/env.js";
import { conflict, forbidden, notFound, unauthorized } from "../../lib/errors.js";
import { randomToken, sha256 } from "../../lib/crypto.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { signAccessToken } from "../../lib/jwt.js";

/**
 * Service d'authentification.
 *
 * Il ne connaît ni Hono ni les cookies : les routes s'occupent du transport,
 * ce service ne manipule que des identités, des jetons et la base.
 */

interface UserRecord {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string | null;
	kind: UserKind;
	status: (typeof t.userStatusEnum.enumValues)[number];
	lastLoginAt: Date | null;
	createdAt: Date;
}

/** Rôles et permissions effectifs d'un compte, dédoublonnés. */
const loadAuthorizations = async (
	userId: string,
): Promise<{ roles: string[]; permissions: string[] }> => {
	const rows = await db
		.select({
			roleKey: t.roles.key,
			permissionKey: t.permissions.key,
		})
		.from(t.userRoles)
		.innerJoin(t.roles, eq(t.roles.id, t.userRoles.roleId))
		.leftJoin(t.rolePermissions, eq(t.rolePermissions.roleId, t.roles.id))
		.leftJoin(t.permissions, eq(t.permissions.id, t.rolePermissions.permissionId))
		.where(eq(t.userRoles.userId, userId));

	const roles = new Set<string>();
	const permissions = new Set<string>();

	for (const row of rows) {
		roles.add(row.roleKey);
		if (row.permissionKey) permissions.add(row.permissionKey);
	}

	return { roles: [...roles], permissions: [...permissions] };
};

const toUser = (
	record: UserRecord,
	authorizations: { roles: string[]; permissions: string[] },
): User => ({
	id: record.id,
	email: record.email,
	firstName: record.firstName,
	lastName: record.lastName,
	phone: record.phone,
	kind: record.kind,
	status: record.status,
	roles: authorizations.roles as User["roles"],
	permissions: authorizations.permissions,
	lastLoginAt: record.lastLoginAt?.toISOString() ?? null,
	createdAt: record.createdAt.toISOString(),
});

const selectUser = {
	id: t.users.id,
	email: t.users.email,
	firstName: t.users.firstName,
	lastName: t.users.lastName,
	phone: t.users.phone,
	kind: t.users.kind,
	status: t.users.status,
	lastLoginAt: t.users.lastLoginAt,
	createdAt: t.users.createdAt,
};

/**
 * Émet un jeton d'accès et un jeton de rafraîchissement.
 *
 * Le jeton de rafraîchissement est opaque et aléatoire ; seule son empreinte
 * SHA-256 est stockée, de sorte qu'une fuite de la base ne permet pas de
 * rejouer une session.
 */
const issueSession = async (
	record: UserRecord,
	context: { userAgent: string | null; ipAddress: string | null },
): Promise<{ auth: AuthResponse; refreshToken: string }> => {
	const authorizations = await loadAuthorizations(record.id);

	const payload: Omit<JwtPayload, "exp" | "iat"> = {
		sub: record.id,
		email: record.email,
		kind: record.kind,
		roles: authorizations.roles,
		permissions: authorizations.permissions,
	};

	const { token, expiresIn } = await signAccessToken(payload);

	const refreshToken = randomToken(48);
	const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1_000);

	await db.insert(t.refreshTokens).values({
		userId: record.id,
		tokenHash: sha256(refreshToken),
		expiresAt,
		userAgent: context.userAgent?.slice(0, 500) ?? null,
		ipAddress: context.ipAddress,
	});

	await db
		.update(t.users)
		.set({ lastLoginAt: new Date() })
		.where(eq(t.users.id, record.id));

	return {
		auth: { user: toUser(record, authorizations), accessToken: token, expiresIn },
		refreshToken,
	};
};

/**
 * Authentifie un compte.
 *
 * `expectedKind` sépare les deux portails : une cliente ne peut pas se
 * connecter au back-office, et un compte back-office n'ouvre pas de session
 * storefront. Le message d'erreur reste identique dans tous les cas d'échec
 * pour ne pas révéler quelles adresses existent.
 */
export const login = async (
	input: LoginInput,
	expectedKind: UserKind,
	context: { userAgent: string | null; ipAddress: string | null },
): Promise<{ auth: AuthResponse; refreshToken: string }> => {
	const [record] = await db
		.select({ ...selectUser, passwordHash: t.users.passwordHash })
		.from(t.users)
		.where(and(sql`lower(${t.users.email}) = ${input.email}`, isNull(t.users.deletedAt)))
		.limit(1);

	const genericFailure = unauthorized("Adresse e-mail ou mot de passe incorrect.");

	if (!record) {
		// Vérification à vide : le temps de réponse ne doit pas trahir
		// l'existence du compte (attaque par énumération).
		await verifyPassword(
			"$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
			input.password,
		);
		throw genericFailure;
	}

	if (!(await verifyPassword(record.passwordHash, input.password))) {
		throw genericFailure;
	}

	if (record.kind !== expectedKind) throw genericFailure;

	if (record.status !== "active") {
		throw forbidden("Ce compte est désactivé. Contactez un administrateur.");
	}

	return issueSession(record, context);
};

/** Inscription d'une cliente (§2.7). Les comptes back-office sont créés depuis le panel. */
export const register = async (
	input: RegisterInput,
	context: { userAgent: string | null; ipAddress: string | null },
): Promise<{ auth: AuthResponse; refreshToken: string }> => {
	const [existing] = await db
		.select({ id: t.users.id })
		.from(t.users)
		.where(and(sql`lower(${t.users.email}) = ${input.email}`, isNull(t.users.deletedAt)))
		.limit(1);

	if (existing) {
		throw conflict("Un compte existe déjà avec cette adresse e-mail.", {
			email: ["Cette adresse est déjà utilisée."],
		});
	}

	const [created] = await db
		.insert(t.users)
		.values({
			email: input.email,
			passwordHash: await hashPassword(input.password),
			firstName: input.firstName,
			lastName: input.lastName,
			phone: input.phone ?? null,
			kind: "customer",
			status: "active",
		})
		.returning(selectUser);

	return issueSession(created!, context);
};

/**
 * Échange un jeton de rafraîchissement contre une nouvelle session.
 *
 * Le jeton présenté est révoqué et remplacé (rotation) : rejouer un ancien
 * jeton échoue, ce qui limite la fenêtre d'exploitation d'un vol.
 */
export const refresh = async (
	refreshToken: string,
	expectedKind: UserKind,
	context: { userAgent: string | null; ipAddress: string | null },
): Promise<{ auth: AuthResponse; refreshToken: string }> => {
	const tokenHash = sha256(refreshToken);

	const [stored] = await db
		.select({ id: t.refreshTokens.id, userId: t.refreshTokens.userId })
		.from(t.refreshTokens)
		.where(
			and(
				eq(t.refreshTokens.tokenHash, tokenHash),
				isNull(t.refreshTokens.revokedAt),
				gt(t.refreshTokens.expiresAt, new Date()),
			),
		)
		.limit(1);

	if (!stored) throw unauthorized("Session expirée, veuillez vous reconnecter.");

	const [record] = await db
		.select(selectUser)
		.from(t.users)
		.where(and(eq(t.users.id, stored.userId), isNull(t.users.deletedAt)))
		.limit(1);

	if (!record || record.kind !== expectedKind || record.status !== "active") {
		await db
			.update(t.refreshTokens)
			.set({ revokedAt: new Date() })
			.where(eq(t.refreshTokens.id, stored.id));
		throw unauthorized("Session expirée, veuillez vous reconnecter.");
	}

	await db
		.update(t.refreshTokens)
		.set({ revokedAt: new Date() })
		.where(eq(t.refreshTokens.id, stored.id));

	return issueSession(record, context);
};

/** Révoque le jeton de rafraîchissement courant. */
export const logout = async (refreshToken: string | undefined): Promise<void> => {
	if (!refreshToken) return;

	await db
		.update(t.refreshTokens)
		.set({ revokedAt: new Date() })
		.where(
			and(
				eq(t.refreshTokens.tokenHash, sha256(refreshToken)),
				isNull(t.refreshTokens.revokedAt),
			),
		);
};

/** Révoque toutes les sessions d'un compte — après changement de mot de passe. */
export const revokeAllSessions = async (userId: string): Promise<void> => {
	await db
		.update(t.refreshTokens)
		.set({ revokedAt: new Date() })
		.where(and(eq(t.refreshTokens.userId, userId), isNull(t.refreshTokens.revokedAt)));
};

export const getProfile = async (userId: string): Promise<User> => {
	const [record] = await db
		.select(selectUser)
		.from(t.users)
		.where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
		.limit(1);

	if (!record) throw notFound("Compte");

	return toUser(record, await loadAuthorizations(userId));
};

export const updateProfile = async (
	userId: string,
	input: { firstName?: string; lastName?: string; phone?: string | null },
): Promise<User> => {
	const [record] = await db
		.update(t.users)
		.set({ ...input, updatedAt: new Date() })
		.where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
		.returning(selectUser);

	if (!record) throw notFound("Compte");

	return toUser(record, await loadAuthorizations(userId));
};

/**
 * Change le mot de passe puis invalide toutes les sessions : après un
 * changement, les jetons émis avant ne doivent plus ouvrir de session.
 */
export const changePassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string,
): Promise<void> => {
	const [record] = await db
		.select({ passwordHash: t.users.passwordHash })
		.from(t.users)
		.where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
		.limit(1);

	if (!record) throw notFound("Compte");

	if (!(await verifyPassword(record.passwordHash, currentPassword))) {
		throw unauthorized("Le mot de passe actuel est incorrect.");
	}

	await db
		.update(t.users)
		.set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() })
		.where(eq(t.users.id, userId));

	await revokeAllSessions(userId);
};
