import { sign, verify } from "hono/jwt";
import { env } from "./env.js";
import { unauthorized } from "./errors.js";
/**
 * Jetons d'accès JWT signés en HS256.
 *
 * Les rôles et permissions sont inlinés dans la charge utile : l'autorisation
 * d'une requête ne coûte alors aucune lecture en base. La contrepartie est
 * qu'un changement de droits ne prend effet qu'au renouvellement du jeton -
 * d'où une durée de vie courte (15 min par défaut) compensée par le
 * rafraîchissement automatique.
 */
export const signAccessToken = async (payload) => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = env.JWT_ACCESS_TTL_SECONDS;
    const token = await sign({ ...payload, iat: issuedAt, exp: issuedAt + expiresIn }, env.JWT_SECRET, "HS256");
    return { token, expiresIn };
};
/**
 * Vérifie un jeton d'accès. Toute erreur - signature invalide, jeton expiré,
 * charge utile mal formée - remonte en 401 sans distinction : un attaquant ne
 * doit pas pouvoir déduire pourquoi son jeton est rejeté.
 */
export const verifyAccessToken = async (token) => {
    try {
        const payload = (await verify(token, env.JWT_SECRET, "HS256"));
        if (!payload?.sub || !Array.isArray(payload.permissions)) {
            throw new Error("charge utile incomplète");
        }
        return payload;
    }
    catch {
        throw unauthorized("Jeton d'accès invalide ou expiré.");
    }
};
/** Extrait le jeton d'un en-tête `Authorization: Bearer …`. */
export const extractBearerToken = (header) => {
    if (!header)
        return null;
    const [scheme, token] = header.split(" ");
    if (!scheme || scheme.toLowerCase() !== "bearer" || !token)
        return null;
    return token.trim() || null;
};
//# sourceMappingURL=jwt.js.map