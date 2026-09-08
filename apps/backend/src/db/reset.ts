import { sql } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { env } from "../lib/env.js";

/**
 * Vide et recrée le schéma `public`.
 *
 * Réservé au développement : refuse de s'exécuter en production, où la
 * remise à zéro doit passer par une migration explicite et une sauvegarde.
 */
const run = async (): Promise<void> => {
	if (env.NODE_ENV === "production") {
		throw new Error("db:reset est interdit en production.");
	}

	console.log(`réinitialisation du schéma sur ${new URL(env.DATABASE_URL).host}`);
	await db.execute(sql`drop schema if exists public cascade`);
	await db.execute(sql`create schema public`);
	console.log("schéma public recréé (vide)");
};

run()
	.catch((error: unknown) => {
		console.error("échec de la réinitialisation :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
