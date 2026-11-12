import { buildMetadata } from "@/lib/seo/site";
import ShippingPrivacyViews from "@/features/shipping-return/views";

export const metadata = buildMetadata({
	title: "Livraison et retours",
	description:
		"Délais et frais de livraison à Abidjan et en Côte d'Ivoire, conditions de retour et de remboursement des commandes Prettyfull.",
	path: "/shipping-return",
	keywords: ["livraison Abidjan","frais de livraison","retour et remboursement"],
});

const Page = () => {
	return (
		<div>
			<ShippingPrivacyViews />
		</div>
	);
};

export default Page;
