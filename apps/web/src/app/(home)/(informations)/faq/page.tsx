import { buildMetadata } from "@/lib/seo/site";
import FaqViews from "@/features/faq/views";


export const metadata = buildMetadata({
	title: "Questions fréquentes : commande, livraison, retours",
	description:
		"Réponses aux questions sur vos commandes Prettyfull : livraison à Abidjan, paiement, retours, authenticité des produits et suivi de colis.",
	path: "/faq",
	keywords: ["FAQ Prettyfull","livraison Abidjan","retour produit","paiement en ligne"],
});

const Page = () => {
	return <FaqViews />;
};

export default Page;
