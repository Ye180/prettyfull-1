import ProductViews from "@/features/products/views";
import { getProduct } from "@/lib/seo/api";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbSchema, productSchema } from "@/lib/seo/schema";
import { buildMetadata, noIndexMetadata, truncate } from "@/lib/seo/site";
import type { Metadata } from "next";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { handle } = await params;
	const product = await getProduct(handle);
	// Produit introuvable (ou API injoignable) : on n'invente rien, et on n'indexe pas.
	if (!product) return noIndexMetadata("Produit");

	return buildMetadata({
		title: product.metaTitle || product.name,
		description:
			product.metaDescription ||
			truncate(product.shortDescription || product.longDescription) ||
			`${product.name} : authentique, livré à Abidjan.`,
		path: `/products/${product.slug}`,
		keywords: [product.name, ...product.tags, ...product.categories.map((category) => category.name)],
		images: product.images.slice(0, 4).map((image) => ({ url: image.url, alt: image.alt || product.name })),
	});
}

export default async function Page({ params }: Props) {
	const { handle } = await params;
	const product = await getProduct(handle);

	return (
		<>
			{product && (
				<JsonLd
					data={[
						productSchema(product),
						breadcrumbSchema([
							{ name: "Accueil", path: "/" },
							{ name: "Collections", path: "/collections" },
							...(product.categories[0]
								? [{ name: product.categories[0].name, path: `/collections/${product.categories[0].slug}` }]
								: []),
							{ name: product.name, path: `/products/${product.slug}` },
						]),
					]}
				/>
			)}
			<ProductViews />
		</>
	);
}
