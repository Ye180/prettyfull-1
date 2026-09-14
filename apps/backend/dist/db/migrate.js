import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { closeDb, db } from "./index.js";
/**
 * Applique les migrations Drizzle, après avoir garanti la présence des
 * extensions Postgres dont le schéma dépend.
 *
 * Les extensions sont créées ici plutôt que dans une migration générée :
 * `drizzle-kit generate` réécrit ses fichiers à chaque évolution du schéma et
 * effacerait l'instruction. `unaccent` est requise par l'index de recherche
 * plein texte des produits.
 */
const REQUIRED_EXTENSIONS = ["unaccent"];
/**
 * `unaccent()` est déclarée STABLE et non IMMUTABLE - Postgres la refuse donc
 * dans une expression d'index. Ce wrapper la redéclare IMMUTABLE, ce qui est
 * correct tant que le dictionnaire `unaccent` n'est pas modifié à chaud (le
 * contournement de référence pour la recherche insensible aux accents).
 */
const IMMUTABLE_UNACCENT = `
	CREATE OR REPLACE FUNCTION pf_unaccent(text)
	RETURNS text
	LANGUAGE sql
	IMMUTABLE
	PARALLEL SAFE
	STRICT
	AS $func$ SELECT public.unaccent('public.unaccent'::regdictionary, $1) $func$;
`;
const run = async () => {
	for (const extension of REQUIRED_EXTENSIONS) {
		await db.execute(sql.raw(`CREATE EXTENSION IF NOT EXISTS ${extension}`));
		console.log(`extension prête : ${extension}`);
	}
	await db.execute(sql.raw(IMMUTABLE_UNACCENT));
	console.log("fonction prête : pf_unaccent");
	const migrationsFolder = resolve(
		dirname(fileURLToPath(import.meta.url)),
		"migrations",
	);
	await migrate(db, { migrationsFolder });
	console.log("migrations appliquées");
};
run()
	.catch((error) => {
		console.error("échec des migrations :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
//# sourceMappingURL=migrate.js.map
