"use client";

import { cn } from "@prettyfull/utils";
import { useEffect, type ReactNode } from "react";
import { IconX } from "@/components/icons";
import { Button } from "./primitives";

/**
 * Boîte de dialogue modale.
 *
 * Écrite sur `<dialog>`-like plutôt qu'avec Radix : le panel n'en a besoin que
 * pour des confirmations et de petits formulaires, et cela évite d'ajouter
 * une dépendance pour trois comportements (fermeture au clavier, verrouillage
 * du défilement, clic sur le fond).
 */
interface DialogProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: ReactNode;
	footer?: ReactNode;
	size?: "sm" | "md" | "lg";
}

const SIZES = {
	sm: "max-w-md",
	md: "max-w-xl",
	lg: "max-w-3xl",
} as const;

export const Dialog = ({
	open,
	onClose,
	title,
	description,
	children,
	footer,
	size = "sm",
}: DialogProps) => {
	// Échap ferme, et le corps ne défile plus derrière la modale.
	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
			// Le clic ne ferme que s'il naît ET meurt sur le fond : sans cela, un
			// glisser-sélectionner de texte terminé hors du panneau fermerait la
			// modale et ferait perdre la saisie.
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={cn(
					"w-full rounded-xl border border-line bg-raised shadow-xl",
					SIZES[size],
				)}
			>
				<div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
					<div className="min-w-0">
						<h2 className="font-semibold text-ink">{title}</h2>
						{description && (
							<p className="mt-0.5 text-[13px] text-muted">{description}</p>
						)}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="shrink-0 rounded p-1 text-subtle hover:bg-accent-soft hover:text-ink"
						aria-label="Fermer"
					>
						<IconX width={16} height={16} />
					</button>
				</div>

				<div className="px-4 py-4">{children}</div>

				{footer && (
					<div className="flex justify-end gap-2 border-t border-line px-4 py-3">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

/** Confirmation d'une action destructive (archivage, suppression). */
export const ConfirmDialog = ({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = "Confirmer",
	loading = false,
	tone = "danger",
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	loading?: boolean;
	tone?: "danger" | "primary";
}) => (
	<Dialog
		open={open}
		onClose={onClose}
		title={title}
		footer={
			<>
				<Button onClick={onClose} disabled={loading}>
					Annuler
				</Button>
				<Button variant={tone} onClick={onConfirm} loading={loading}>
					{confirmLabel}
				</Button>
			</>
		}
	>
		<p className="text-[13px] text-muted">{message}</p>
	</Dialog>
);
