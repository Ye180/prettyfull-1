import CollectionViews from "@/features/collections/views";
import { getCategory } from "@/lib/seo/api";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/schema";
import { buildMetadata, noIndexMetadata, SITE_NAME } from "@/lib/seo/site";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const category = await getCategory(slug);
	if (!category) return noIndexMetadata("Collection");

	return buildMetadata({
		title: category.metaTitle || `${category.name} : achat en ligne à Abidjan`,
		description:
			category.metaDescription ||
			category.description ||
			`Découvrez notre sélection ${category.name.toLowerCase()} sur ${SITE_NAME} : produits authentiques, livraison à Abidjan.`,
		path: `/collections/${category.slug}`,
		keywords: [category.name, `${category.name} Abidjan`],
		images: category.imageUrl ? [{ url: category.imageUrl, alt: category.name }] : undefined,
	});
}

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const category = await getCategory(slug);

	return (
		<>
			{category && (
				<JsonLd
					data={[
						collectionSchema(category),
						breadcrumbSchema([
							{ name: "Accueil", path: "/" },
							{ name: "Collections", path: "/collections" },
							{ name: category.name, path: `/collections/${category.slug}` },
						]),
					]}
				/>
			)}
			<CollectionViews />
		</>
	);
}
