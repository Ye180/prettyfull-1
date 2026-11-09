/** Une URL signée telle que renvoyée par l'API (`PresignedUpload` des contrats). */
export interface PresignedFile {
	uploadUrl: string;
	publicUrl: string;
	headers: Record<string, string>;
}

/**
 * Envoie chaque fichier directement au stockage (Cloudflare R2) avec son URL
 * signée, puis renvoie leurs adresses publiques, dans l'ordre.
 *
 * Les en-têtes sont repris tels que signés : en changer un seul fait refuser
 * la requête (403). Tout échoue ou tout passe - un envoi partiel laisserait
 * des fichiers orphelins que rien ne référence.
 */
export const uploadToStorage = async (
	files: File[],
	presigned: PresignedFile[],
): Promise<string[]> => {
	if (files.length !== presigned.length) {
		throw new Error("Réponse de téléversement incohérente.");
	}

	await Promise.all(
		files.map(async (file, index) => {
			const target = presigned[index]!;
			let response: Response;

			try {
				response = await fetch(target.uploadUrl, {
					method: "PUT",
					headers: target.headers,
					body: file,
				});
			} catch {
				// Échec réseau, ou CORS du bucket non configuré (le navigateur
				// ne distingue pas les deux).
				throw new Error(
					`« ${file.name} » n'a pas pu être envoyé. Vérifiez votre connexion.`,
				);
			}

			if (!response.ok) {
				throw new Error(`« ${file.name} » refusé par le stockage (HTTP ${response.status}).`);
			}
		}),
	);

	return presigned.map((target) => target.publicUrl);
};
