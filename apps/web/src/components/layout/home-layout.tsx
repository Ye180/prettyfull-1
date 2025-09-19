import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	return (
		<>
			<Header />
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</>
	);
};

export default HomeLayout;
