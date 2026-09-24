import type { Metadata } from "next";
import FaqViews from "@/features/faq/views";

export const metadata: Metadata = {
	title: "Frequently Asked Questions - Prettyfull",
	description:
		"Find answers to questions about Prettyfull orders, global shipping, returns, sizing, materials, and payment methods.",
};

const Page = () => {
	return <FaqViews />;
};

export default Page;
