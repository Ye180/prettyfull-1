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
			<header className="h-[10vh] border-2 border-orange-100"></header>
			<body>{children}</body>
		</>
	);
};

export default HomeLayout;
