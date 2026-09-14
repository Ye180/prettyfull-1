import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import { badRequest } from "../lib/errors.js";

/**
 * Validation Zod avec une enveloppe d'erreur homogène.
 *
 * `zValidator` renvoie par défaut une réponse 400 à son propre format ; ce
 * wrapper lève une `AppError` à la place, pour que toutes les erreurs de
 * l'API - validation comprise - sortent avec la même forme et soient
 * exploitables par les formulaires du panel.
 */
export const validate = <Target extends keyof ValidationTargets, Schema extends ZodType>(
	target: Target,
	schema: Schema,
) =>
	zValidator(target, schema, (result) => {
		if (result.success) return;

		const details: Record<string, string[]> = {};
		for (const issue of result.error.issues) {
			const path = issue.path.join(".") || "_";
			(details[path] ??= []).push(issue.message);
		}

		throw badRequest("Les données envoyées sont invalides.", details);
	});
