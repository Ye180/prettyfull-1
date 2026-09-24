import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Charge `apps/backend/.env` dans `process.env` avant toute lecture.
 *
 * Importé en premier par `env.ts` pour que `tsx`, `drizzle-kit` et les
 * scripts ponctuels voient la même configuration sans dépendance externe.
 * Les variables déjà présentes dans l'environnement ne sont pas écrasées :
 * en production, c'est l'orchestrateur qui fait foi, pas un fichier.
 */
const loadEnvFile = (): void => {
	const path = resolve(process.cwd(), ".env");
	if (!existsSync(path)) return;

	// Ajouté dans Node 20.12 - on reste tolérant sur les runtimes plus anciens.
	if (typeof process.loadEnvFile !== "function") return;

	try {
		process.loadEnvFile(path);
	} catch {
		// Fichier illisible ou mal formé : la validation de `env.ts` produira
		// un message bien plus utile que l'erreur de parsing brute.
	}
};

loadEnvFile();
