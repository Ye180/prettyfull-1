import HomeLayout from "@/components/layout/home-layout";
import { PropsWithChildren } from "react";

const HomeRootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <HomeLayout children={children} />;
};

export default HomeRootLayout;
