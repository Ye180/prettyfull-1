import { createCipheriv, createDecipheriv, randomBytes, createHash, timingSafeEqual, } from "node:crypto";
import { env } from "./env.js";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const key = Buffer.from(env.CREDENTIALS_ENCRYPTION_KEY, "hex");
/**
 * Chiffre une valeur sensible (clé API d'agrégateur) en AES-256-GCM.
 *
 * Le format de sortie est `iv:authTag:données`, en base64. GCM est
 * authentifié : une valeur altérée en base est rejetée au déchiffrement au
 * lieu de produire silencieusement des octets faux.
 */
export const encryptSecret = (plain) => {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64"),
    ].join(":");
};
/** Déchiffre une valeur produite par `encryptSecret`. Lève si elle a été altérée. */
export const decryptSecret = (payload) => {
    const [ivPart, tagPart, dataPart] = payload.split(":");
    if (!ivPart || !tagPart || !dataPart) {
        throw new Error("Valeur chiffrée mal formée.");
    }
    const authTag = Buffer.from(tagPart, "base64");
    if (authTag.length !== AUTH_TAG_LENGTH) {
        throw new Error("Valeur chiffrée mal formée.");
    }
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivPart, "base64"));
    decipher.setAuthTag(authTag);
    return Buffer.concat([
        decipher.update(Buffer.from(dataPart, "base64")),
        decipher.final(),
    ]).toString("utf8");
};
/** Chiffre chaque valeur d'un dictionnaire de secrets. */
export const encryptCredentials = (credentials) => Object.fromEntries(Object.entries(credentials).map(([name, value]) => [name, encryptSecret(value)]));
/**
 * Déchiffre un dictionnaire de secrets. Une entrée illisible est ignorée
 * plutôt que de faire échouer toute la configuration : l'adaptateur signalera
 * la clé manquante avec un message exploitable.
 */
export const decryptCredentials = (credentials) => {
    const result = {};
    for (const [name, value] of Object.entries(credentials)) {
        try {
            result[name] = decryptSecret(value);
        }
        catch {
            continue;
        }
    }
    return result;
};
/** Empreinte SHA-256 en hexadécimal - utilisée pour stocker les refresh tokens. */
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
/** Comparaison à temps constant, pour les signatures de webhook. */
export const safeCompare = (a, b) => {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length)
        return false;
    return timingSafeEqual(bufferA, bufferB);
};
/** Jeton opaque aléatoire (refresh token, session panier invité). */
export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
//# sourceMappingURL=crypto.js.map