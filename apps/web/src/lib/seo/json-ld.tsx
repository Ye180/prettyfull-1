/**
 * Données structurées Schema.org, injectées en JSON-LD.
 *
 * `<` est échappé : une valeur venant du back-office (nom, description) qui
 * contiendrait `</script>` ne doit pas pouvoir fermer la balise.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	);
}
