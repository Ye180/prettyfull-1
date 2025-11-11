import { cn } from "@/lib/utils";

export const Logo = (props) => {
	return (
		<div className={cn("w-[10rem] relative ", props.className)}>
			<img
				className="-ml-4"
				src="/assets/logo.png"
				alt="Logo"
				width={200}
				height={100}
				loading="eager"
			/>
		</div>
	);
};
