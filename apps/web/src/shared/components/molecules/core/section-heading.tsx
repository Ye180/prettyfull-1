import { cn } from "@prettyfull/utils";

export interface SectionHeadingProps {
	title: string;
	description?: string;
	className?: string;
	align?: "left" | "center";
}

/**
 * Titre de section minimaliste : intitulé compact + trait fin, sans le grand
 * espace vertical des titres historiques du site.
 */
const SectionHeading = ({
	title,
	description,
	className,
	align = "left",
}: SectionHeadingProps) => (
	<div
		className={cn(
			"space-y-2",
			align === "center" && "text-center flex flex-col items-center",
			className,
		)}
	>
		<h2 className="text-[2.4rem]! md:text-[3rem]! leading-tight">{title}</h2>
		<hr className="w-12 border-t border-border" />
		{description && (
			<p className="max-w-md text-[1.4rem] text-muted">{description}</p>
		)}
	</div>
);

export default SectionHeading;
