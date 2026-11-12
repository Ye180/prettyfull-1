import ShopAllView from "@/features/collections/views/shop-all-view";
import { buildMetadata } from "@/lib/seo/site";

export const metadata = buildMetadata({
	title: "Toutes nos collections : vitamines, soins, parfums, iPhone",
	description:
		"Parcourez toute la boutique Prettyfull : vitamines et compléments, soins du visage et du corps, parfums, iPhone et épicerie américaine, livrés à Abidjan.",
	path: "/collections",
	keywords: ["boutique Prettyfull", "vitamines", "soins", "parfums", "iPhone", "épicerie américaine"],
});

const CollectionsPage = () => {
	return <ShopAllView />;
};

export default CollectionsPage;
