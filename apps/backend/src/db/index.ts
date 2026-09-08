import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env.js";
import * as schema from "./schema/index.js";

/**
 * Connexion Postgres partagée.
 *
 * Neon est atteint via son pooler : on garde un pool applicatif volontairement
 * étroit pour ne pas saturer le nombre de connexions du plan, et `prepare`
 * est désactivé car le pooler en mode transaction ne conserve pas les
 * requêtes préparées entre deux allers-retours.
 */
const client = postgres(env.DATABASE_URL, {
	max: env.DATABASE_POOL_MAX,
	idle_timeout: 20,
	connect_timeout: 15,
	prepare: false,
});

export const db = drizzle(client, { schema, logger: env.DB_LOGGING });

export type Database = typeof db;

/** Transaction Drizzle : type attendu par les services qui composent des écritures. */
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

/** Ferme le pool — utilisé par les scripts ponctuels (seed, migrations). */
export const closeDb = () => client.end({ timeout: 5 });

export { schema, client };
