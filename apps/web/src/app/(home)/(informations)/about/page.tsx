import { buildMetadata } from "@/lib/seo/site";
import AboutViews from "@/features/about/views";


export const metadata = buildMetadata({
	title: "À propos : des produits américains authentiques",
	description:
		"Prettyfull importe des vitamines, compléments et soins des États-Unis : ingrédients testés, dosages précis, produits authentiques livrés à Abidjan.",
	path: "/about",
	keywords: ["à propos Prettyfull","produits américains authentiques","vitamines testées en laboratoire"],
});

const Page = () => <AboutViews />;

export default Page;
