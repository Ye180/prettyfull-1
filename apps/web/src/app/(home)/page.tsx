import HomeView from "@/features/homepage/views/home.view";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import type { Metadata } from "next";

// Seule page à porter le titre complet (sans le gabarit « | Prettyfull »).
export const metadata: Metadata = {
	title: { absolute: `${SITE_NAME} : ${SITE_TAGLINE}` },
	description: SITE_DESCRIPTION,
	alternates: { canonical: "/" },
};

async function Page() {
	return <HomeView />;
}

export default Page;
