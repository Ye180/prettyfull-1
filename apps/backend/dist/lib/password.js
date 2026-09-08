import { hash, verify } from "@node-rs/argon2";
/**
 * Paramètres Argon2id. Le profil suit les recommandations OWASP
 * (19 Mio de mémoire, 2 passes) : coûteux à attaquer par force brute, tout en
 * restant sous les ~50 ms sur un serveur modeste.
 */
const OPTIONS = {
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
};
export const hashPassword = (plain) => hash(plain, OPTIONS);
/**
 * Vérifie un mot de passe. Retourne `false` au lieu de propager une erreur si
 * le hash stocké est illisible : un enregistrement corrompu ne doit pas
 * transformer un échec d'authentification en erreur 500.
 */
export const verifyPassword = async (storedHash, plain) => {
    try {
        return await verify(storedHash, plain, OPTIONS);
    }
    catch {
        return false;
    }
};
//# sourceMappingURL=password.js.map