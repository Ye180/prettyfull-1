import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import HomeLayout from "../../../../../packages/ui/src/layouts/home-layout";

export const metadata: Metadata = {
	title: "PrettyFull ",
	description: "le site e-commerce pour les passionnés de mode.",
	// ... other metadata properties
};

const HomeRootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <HomeLayout children={children} />;
};

export default HomeRootLayout;
