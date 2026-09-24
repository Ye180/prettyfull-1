import type { Metadata } from "next";
import ContactViews from "@/features/contact/views";

export const metadata: Metadata = {
	title: "Contact - PrettyFull",
	description:
		"Une question sur une taille, un colis ou un retour ? Écrivez-nous, nous répondons sous 24 heures ouvrées.",
};

const Page = () => <ContactViews />;

export default Page;
