import { buildMetadata } from "@/lib/seo/site";
import ContactViews from "@/features/contact/views";


export const metadata = buildMetadata({
	title: "Contact : une question sur une commande ?",
	description:
		"Une question sur un produit, un colis ou un retour ? Écrivez à l'équipe Prettyfull, nous répondons sous 24 heures ouvrées.",
	path: "/contact",
	keywords: ["contact Prettyfull","service client Abidjan"],
});

const Page = () => <ContactViews />;

export default Page;
