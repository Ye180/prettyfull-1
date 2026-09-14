import { zValidator } from "@hono/zod-validator";
import { badRequest } from "../lib/errors.js";
/**
 * Validation Zod avec une enveloppe d'erreur homogène.
 *
 * `zValidator` renvoie par défaut une réponse 400 à son propre format ; ce
 * wrapper lève une `AppError` à la place, pour que toutes les erreurs de
 * l'API - validation comprise - sortent avec la même forme et soient
 * exploitables par les formulaires du panel.
 */
export const validate = (target, schema) =>
	zValidator(target, schema, (result) => {
		if (result.success) return;
		const details = {};
		for (const issue of result.error.issues) {
			const path = issue.path.join(".") || "_";
			(details[path] ??= []).push(issue.message);
		}
		throw badRequest("Les données envoyées sont invalides.", details);
	});
//# sourceMappingURL=validate.js.map
