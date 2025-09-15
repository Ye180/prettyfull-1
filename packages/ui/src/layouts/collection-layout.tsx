import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface CollectionProps {
	className?: string;
}

const CollectionLayout = ({
	children,
	className,
}: PropsWithChildren<CollectionProps>) => {
	return (
		<>
			<div className={cn(className)}>{children}</div>
		</>
	);
};

export default CollectionLayout;
