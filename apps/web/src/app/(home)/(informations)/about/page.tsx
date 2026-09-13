import type { Metadata } from "next";
import AboutViews from "@/features/about/views";

export const metadata: Metadata = {
	title: "About Us — Prettyfull",
	description:
		"Discover Prettyfull's timeless design perspective, sustainable luxury textures, and thoughtful everyday silhouettes.",
};

const Page = () => <AboutViews />;

export default Page;
