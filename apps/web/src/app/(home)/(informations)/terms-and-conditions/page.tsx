import { buildMetadata } from "@/lib/seo/site";
import TermsAndConditionsViews from "@/features/terms-and-conditions/views";

export const metadata = buildMetadata({
	title: "Conditions générales de vente",
	description:
		"Conditions générales de vente de Prettyfull : commandes, paiement, livraison, retours, données personnelles.",
	path: "/terms-and-conditions",
	keywords: [],
});

const Page = () => {
	return (
		<div>
			<TermsAndConditionsViews />
		</div>
	);
};

export default Page;
