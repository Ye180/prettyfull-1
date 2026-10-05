import { cn } from "@prettyfull/utils";
import BrandLogo from "./brand-logo";

export const LoadingPrettyfull = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"flex relative justify-center items-center w-full h-full bg-gray-200 animate-pulse",
			className,
		)}
	>
		<BrandLogo className="text-[4rem] sm:text-[6rem] opacity-60" />
		<div className="absolute inset-0 w-full h-full bg-gray-300/50"></div>
	</div>
);
