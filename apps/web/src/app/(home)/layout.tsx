"use client"; 

import HomeLayout from "@/components/layout/home-layout";
import { PropsWithChildren } from "react";
import { useCartSync } from "@/hooks/useCartSync"; 

const HomeRootLayout = ({ children }: PropsWithChildren<{}>) => {
	useCartSync();

	return <HomeLayout children={children} />;
};

export default HomeRootLayout;