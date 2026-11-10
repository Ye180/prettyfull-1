import { env } from "../lib/env.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "postgres"]);

/**
 * Garde des scripts destructifs (`db:reset`, `db:seed`).
 *
 * `NODE_ENV` ne suffit pas : lancé depuis un poste de développement avec
 * l'URL de la base de production, le script verrait `development` et
 * effacerait tout - puis créerait un super-administrateur au mot de passe
 * public. On exige donc une base locale, sauf autorisation explicite qui
 * nomme l'hôte visé (`ALLOW_DESTRUCTIVE_DB=<hôte>`).
 */
export const assertDisposableDatabase = (script: string): void => {
	const host = new URL(env.DATABASE_URL).hostname;

	if (env.NODE_ENV === "production") {
		throw new Error(`${script} est interdit en production.`);
	}
	if (!LOCAL_HOSTS.has(host) && process.env.ALLOW_DESTRUCTIVE_DB !== host) {
		throw new Error(
			`${script} refusé sur la base distante « ${host} ». ` +
				`Si c'est voulu (base de préproduction jetable) : ALLOW_DESTRUCTIVE_DB=${host}.`,
		);
	}
};
