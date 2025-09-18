import Footer from "@/shared/components/molecules/footer";
import Header from "@/shared/components/molecules/header";
import { PropsWithChildren } from "react";

interface HomeLayoutProps {
	className?: string;
}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	return (
		<>
			<Header />
			<div className="h-fit">{children}</div>
			<Footer />
		</>
	);
};

export default HomeLayout;
