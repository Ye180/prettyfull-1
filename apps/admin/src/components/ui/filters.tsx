"use client";

import type { ReactNode } from "react";
import { Button, Input, Select } from "./primitives";
import { IconSearch, IconX } from "@/components/icons";

/**
 * Barre de filtres.
 *
 * Une seule rangée au-dessus de la liste : recherche à gauche, filtres à
 * droite, remise à zéro visible seulement quand elle sert à quelque chose.
 */
export const FilterBar = ({
	search,
	onSearchChange,
	searchPlaceholder = "Rechercher…",
	onReset,
	showReset,
	children,
}: {
	search?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	onReset?: () => void;
	showReset?: boolean;
	children?: ReactNode;
}) => (
	<div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
		{onSearchChange && (
			<div className="relative min-w-48 flex-1 sm:max-w-72">
				<IconSearch
					width={15}
					height={15}
					className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle"
				/>
				<Input
					value={search ?? ""}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder={searchPlaceholder}
					className="pl-8"
					aria-label={searchPlaceholder}
				/>
			</div>
		)}

		{children}

		{showReset && onReset && (
			<Button size="sm" variant="ghost" onClick={onReset}>
				<IconX width={14} height={14} />
				Réinitialiser
			</Button>
		)}
	</div>
);

/** Filtre déroulant compact, avec une option « tous » implicite. */
export const FilterSelect = ({
	value,
	onChange,
	options,
	placeholder,
	label,
}: {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder: string;
	label: string;
}) => (
	<Select
		value={value}
		onChange={(event) => onChange(event.target.value)}
		options={options}
		placeholder={placeholder}
		aria-label={label}
		className="w-auto min-w-40"
	/>
);
