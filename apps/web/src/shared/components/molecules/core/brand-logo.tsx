import { cn } from "@prettyfull/utils";

/**
 * Logo texte PRETTYFULL, façon wordmark naturium : capitales grasses très
 * espacées. La marge négative compense l'espacement ajouté après la
 * dernière lettre, sans quoi le mot paraît décalé à gauche une fois centré.
 */
export const BrandLogo = ({ className }: { className?: string }) => (
	<span
		className={cn(
			"inline-block mr-[-0.32em] font-sans font-bold uppercase leading-none tracking-[0.32em] text-(--color-ink)",
			className,
		)}
	>
		Prettyfull
	</span>
);

export default BrandLogo;
