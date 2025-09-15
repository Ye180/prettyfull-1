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
			{/* <Header /> */}
			<body>{children}</body>
			{/* <Footer /> */}
		</>
	);
};

export default HomeLayout;
