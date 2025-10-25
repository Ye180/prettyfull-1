import { cn } from "@prettyfull/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("bg-accent animate-pulse rounded-0 bg-gray-200", className)}
			{...props}
		/>
	);
}

export { Skeleton };
