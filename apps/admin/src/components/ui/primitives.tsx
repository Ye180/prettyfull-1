"use client";

import { cn } from "@prettyfull/utils";
import {
	cloneElement,
	isValidElement,
	useId,
	type ButtonHTMLAttributes,
	type InputHTMLAttributes,
	type ReactElement,
	type ReactNode,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
} from "react";
import { IconSpinner } from "@/components/icons";

/**
 * Primitives d'interface du back-office.
 *
 * Denses par défaut (hauteur 34 px, texte 14 px) : un écran de gestion affiche
 * des dizaines de lignes, là où le storefront respire. Toutes s'appuient sur
 * les tokens de `globals.css`, jamais sur des couleurs en dur, pour rester
 * cohérentes en thème clair comme sombre.
 */

// --- Bouton ----------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
	primary: "bg-accent text-accent-ink hover:opacity-90 border-transparent",
	secondary: "bg-raised text-ink border-line-strong hover:bg-accent-soft",
	ghost:
		"bg-transparent text-muted border-transparent hover:bg-accent-soft hover:text-ink",
	danger: "bg-danger text-white border-transparent hover:opacity-90",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
	sm: "h-8 px-2.5 text-[13px] gap-1.5",
	md: "h-9 px-3.5 gap-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Affiche un indicateur et neutralise le bouton pendant l'action. */
	loading?: boolean;
}

export const Button = ({
	variant = "secondary",
	size = "md",
	loading = false,
	disabled,
	className,
	children,
	...props
}: ButtonProps) => (
	<button
		type="button"
		disabled={disabled || loading}
		className={cn(
			"inline-flex items-center justify-center rounded-md border font-medium",
			"transition-colors disabled:cursor-not-allowed disabled:opacity-50",
			"whitespace-nowrap select-none",
			BUTTON_VARIANTS[variant],
			BUTTON_SIZES[size],
			className,
		)}
		{...props}
	>
		{loading && <IconSpinner width={15} height={15} />}
		{children}
	</button>
);

// --- Champs ----------------------------------------------------------------

const FIELD_BASE =
	"w-full rounded-md border border-line bg-raised px-2.5 text-ink " +
	"placeholder:text-subtle transition-colors " +
	"focus:border-line-strong disabled:opacity-60 disabled:cursor-not-allowed " +
	"aria-[invalid=true]:border-danger";

export const Input = ({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) => (
	<input className={cn(FIELD_BASE, "h-9", className)} {...props} />
);

export const Textarea = ({
	className,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
	<textarea
		className={cn(FIELD_BASE, "py-2 min-h-20 resize-y", className)}
		{...props}
	/>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	options: { value: string; label: string }[];
	/** Option vide en tête, pour les filtres facultatifs. */
	placeholder?: string;
}

export const Select = ({
	options,
	placeholder,
	className,
	...props
}: SelectProps) => (
	<select
		className={cn(FIELD_BASE, "h-9 pr-8 cursor-pointer", className)}
		{...props}
	>
		{placeholder && <option value="">{placeholder}</option>}
		{options.map((option) => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</select>
);

interface FieldProps {
	label: string;
	htmlFor?: string;
	/** Message d'erreur renvoyé par l'API, affiché sous le champ. */
	error?: string;
	hint?: string;
	required?: boolean;
	className?: string;
	children: ReactNode;
}

/**
 * Libellé + champ + message.
 *
 * Quand l'enfant est un champ de ce module, un identifiant lui est généré et
 * le libellé y est rattaché : sans cette liaison, le libellé n'est qu'un texte
 * décoratif - un lecteur d'écran annonce un champ anonyme, et cliquer dessus
 * ne donne pas le focus.
 *
 * La liaison est **restreinte aux vrais contrôles** : plusieurs appels
 * enveloppent un `<div>` (sélecteur de couleur, liste de cases à cocher), et
 * un `htmlFor` pointant vers un conteneur produirait une association invalide,
 * pire que pas d'association du tout. Ces cas gardent un libellé simple et
 * portent leur propre `aria-label`.
 */
const LABELABLE = new Set<unknown>([Input, Select, Textarea]);

export const Field = ({
	label,
	htmlFor,
	error,
	hint,
	required,
	className,
	children,
}: FieldProps) => {
	const generatedId = useId();

	const child = isValidElement(children)
		? (children as ReactElement<{ id?: string }>)
		: null;

	const isControl = child !== null && LABELABLE.has(child.type);
	const fieldId =
		htmlFor ?? child?.props.id ?? (isControl ? generatedId : undefined);

	const control =
		isControl && child && !child.props.id && !htmlFor
			? cloneElement(child, { id: fieldId })
			: children;

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label htmlFor={fieldId} className="text-[13px] font-medium text-ink">
				{label}
				{required && <span className="text-danger"> *</span>}
			</label>
			{control}
			{error ? (
				<p className="text-[12px] text-danger">{error}</p>
			) : hint ? (
				<p className="text-[12px] text-subtle">{hint}</p>
			) : null}
		</div>
	);
};

export const Checkbox = ({
	label,
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
	<label
		className={cn("inline-flex items-center gap-2 cursor-pointer", className)}
	>
		<input
			type="checkbox"
			className="size-4 rounded border-line-strong accent-[var(--accent)]"
			{...props}
		/>
		<span className="text-[13px] text-ink">{label}</span>
	</label>
);

// --- Conteneurs ------------------------------------------------------------

export const Card = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => (
	<div className={cn("rounded-lg border border-line bg-raised", className)}>
		{children}
	</div>
);

export const CardHeader = ({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) => (
	<div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
		<div className="min-w-0">
			<h2 className="font-semibold text-ink">{title}</h2>
			{description && (
				<p className="mt-0.5 text-[13px] text-muted">{description}</p>
			)}
		</div>
		{action}
	</div>
);

// --- Étiquettes d'état -----------------------------------------------------

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const BADGE_TONES: Record<BadgeTone, string> = {
	neutral: "bg-accent-soft text-muted",
	success: "bg-success-soft text-success",
	warning: "bg-warning-soft text-warning",
	danger: "bg-danger-soft text-danger",
	info: "bg-info-soft text-info",
};

export const Badge = ({
	tone = "neutral",
	children,
	className,
}: {
	tone?: BadgeTone;
	children: ReactNode;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium whitespace-nowrap",
			BADGE_TONES[tone],
			className,
		)}
	>
		{children}
	</span>
);

/** Correspondance statut de commande → couleur d'étiquette. */
export const orderStatusTone = (status: string): BadgeTone => {
	if (status === "delivered" || status === "paid") return "success";
	if (status === "pending_payment" || status === "preparing") return "warning";
	if (status === "cancelled" || status === "refunded" || status === "disputed")
		return "danger";
	if (status === "shipped") return "info";
	return "neutral";
};

export const stockStatusTone = (status: string): BadgeTone =>
	status === "in_stock"
		? "success"
		: status === "low_stock"
			? "warning"
			: "danger";

export const contentStatusTone = (status: string): BadgeTone =>
	status === "published"
		? "success"
		: status === "archived"
			? "neutral"
			: "warning";

// --- États de page ---------------------------------------------------------

export const EmptyState = ({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) => (
	<div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
		<p className="font-medium text-ink">{title}</p>
		{description && (
			<p className="max-w-sm text-[13px] text-muted">{description}</p>
		)}
		{action && <div className="mt-2">{action}</div>}
	</div>
);

export const Spinner = ({ label }: { label?: string }) => (
	<div className="flex items-center justify-center gap-2 py-14 text-muted">
		<IconSpinner width={18} height={18} />
		{label && <span className="text-[13px]">{label}</span>}
	</div>
);

/** Bloc d'erreur générique, affiché quand une requête échoue. */
export const ErrorState = ({
	message,
	retry,
}: {
	message: string;
	retry?: () => void;
}) => (
	<div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
		<p className="text-[13px] text-danger">{message}</p>
		{retry && (
			<Button size="sm" onClick={retry}>
				Réessayer
			</Button>
		)}
	</div>
);

export const Skeleton = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse rounded bg-accent-soft", className)} />
);
