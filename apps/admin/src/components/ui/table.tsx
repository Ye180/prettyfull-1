"use client";

import { cn } from "@prettyfull/utils";
import type { PaginationMeta } from "@prettyfull/contracts";
import type { ReactNode } from "react";
import { Button } from "./primitives";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { mediaUrl } from "@/lib/media";

/**
 * Tableau de données.
 *
 * Un composant générique plutôt que du markup répété dans chaque module :
 * les neuf écrans du panel partagent la même densité, le même comportement de
 * défilement horizontal et la même pagination.
 */

export interface Column<T> {
	key: string;
	header: string;
	/** Rendu de la cellule. Reçoit la ligne entière, pas une valeur extraite. */
	cell: (row: T) => ReactNode;
	/** Aligne à droite - pour les montants et les quantités. */
	align?: "left" | "right";
	/** Masque la colonne sous 768 px, pour garder les listes lisibles au mobile. */
	hideOnMobile?: boolean;
	width?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
	empty?: ReactNode;
	/** Squelettes affichés au premier chargement, à la place des lignes. */
	loading?: boolean;
	skeletonRows?: number;
}

export const DataTable = <T,>({
	columns,
	rows,
	rowKey,
	onRowClick,
	empty,
	loading = false,
	skeletonRows = 6,
}: DataTableProps<T>) => {
	if (!loading && rows.length === 0 && empty) return <>{empty}</>;

	return (
		// Le tableau défile dans son propre conteneur : la page, elle, ne doit
		// jamais partir en défilement horizontal.
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-[13px]">
				<thead>
					<tr className="border-b border-line">
						{columns.map((column) => (
							<th
								key={column.key}
								style={column.width ? { width: column.width } : undefined}
								className={cn(
									"px-4 py-2.5 text-left font-medium text-subtle whitespace-nowrap",
									column.align === "right" && "text-right",
									column.hideOnMobile && "hidden md:table-cell",
								)}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{loading
						? Array.from({ length: skeletonRows }, (_, index) => (
								<tr key={index} className="border-b border-line last:border-0">
									{columns.map((column) => (
										<td
											key={column.key}
											className={cn(
												"px-4 py-3",
												column.hideOnMobile && "hidden md:table-cell",
											)}
										>
											<div className="h-3.5 animate-pulse rounded bg-accent-soft" />
										</td>
									))}
								</tr>
							))
						: rows.map((row) => (
								<tr
									key={rowKey(row)}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
									className={cn(
										"border-b border-line last:border-0",
										onRowClick && "cursor-pointer hover:bg-sunken",
									)}
								>
									{columns.map((column) => (
										<td
											key={column.key}
											className={cn(
												"px-4 py-3 align-middle text-ink",
												column.align === "right" && "text-right tabular",
												column.hideOnMobile && "hidden md:table-cell",
											)}
										>
											{column.cell(row)}
										</td>
									))}
								</tr>
							))}
				</tbody>
			</table>
		</div>
	);
};

/**
 * Pagination par pages.
 *
 * Affiche le décompte réel plutôt que de simples flèches : sur un catalogue,
 * savoir qu'on regarde « 21–40 sur 187 » change la façon de chercher.
 */
export const Pagination = ({
	meta,
	onChange,
}: {
	meta: PaginationMeta;
	onChange: (page: number) => void;
}) => {
	if (meta.total === 0) return null;

	const first = (meta.page - 1) * meta.limit + 1;
	const last = Math.min(meta.page * meta.limit, meta.total);

	return (
		<div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
			<p className="text-[12px] text-muted tabular">
				{first}–{last} sur {meta.total}
			</p>

			<div className="flex items-center gap-1">
				<Button
					size="sm"
					variant="ghost"
					disabled={!meta.hasPrevious}
					onClick={() => onChange(meta.page - 1)}
					aria-label="Page précédente"
				>
					<IconChevronLeft width={16} height={16} />
				</Button>
				<span className="px-2 text-[12px] text-muted tabular">
					{meta.page} / {Math.max(1, meta.totalPages)}
				</span>
				<Button
					size="sm"
					variant="ghost"
					disabled={!meta.hasNext}
					onClick={() => onChange(meta.page + 1)}
					aria-label="Page suivante"
				>
					<IconChevronRight width={16} height={16} />
				</Button>
			</div>
		</div>
	);
};

/** Vignette carrée d'un produit, avec repli lorsque l'image manque. */
export const Thumb = ({ src, alt }: { src?: string | null; alt: string }) => {
	const url = mediaUrl(src);

	return (
		<div className="size-9 shrink-0 overflow-hidden rounded border border-line bg-sunken">
			{url ? (
				/*
				 * Les visuels proviennent du storefront (chemins /public) et d'URL
				 * externes inconnues à la compilation : `next/image` imposerait une
				 * liste d'hôtes que l'administrateur ne peut pas maintenir.
				 */
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={url}
					alt={alt}
					className="size-full object-cover"
					loading="lazy"
				/>
			) : null}
		</div>
	);
};
