import type { Metadata } from "next";
import AboutViews from "@/features/about/views";

export const metadata: Metadata = {
	title: "À propos — PrettyFull",
	description:
		"PrettyFull réunit des pièces féminines sélectionnées une à une, livrées depuis Abidjan dans toute l'Afrique de l'Ouest.",
};

const Page = () => <AboutViews />;

export default Page;
