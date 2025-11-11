"use client";

import HomeLayout from "@/components/layout/home-layout";
// import { useCartSync } from "@/hooks/useCartSync";
import { PropsWithChildren } from "react";

const HomeRootLayout = ({ children }: PropsWithChildren<{}>) => {
	// useCartSync();

	return <HomeLayout children={children} />;
};

export default HomeRootLayout;
