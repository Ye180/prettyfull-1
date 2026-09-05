"use client";

import type { CurrencyCode } from "@prettyfull/contracts";
import { useId, useMemo, useState } from "react";
import { formatMoney, formatNumber } from "@/lib/format";

/**
 * Chiffre d'affaires journalier.
 *
 * Une seule série, donc aucune légende : le titre de la carte la nomme. Le
 * nombre de commandes n'a **pas** son propre axe — deux échelles sur un même
 * graphique se lisent mal et invitent aux fausses corrélations ; il apparaît
 * dans l'infobulle, là où il éclaire un point précis.
 *
 * Le tracé est en SVG pur : une bibliothèque de graphiques pèserait plus lourd
 * que ce fichier pour une courbe et une aire.
 */

interface Point {
	date: string;
	revenue: number;
	orders: number;
}

const WIDTH = 720;
const HEIGHT = 200;
const PADDING = { top: 12, right: 8, bottom: 22, left: 8 };

export const RevenueChart = ({
	series,
	currency,
}: {
	series: Point[];
	currency: CurrencyCode;
}) => {
	const gradientId = useId();
	const [hovered, setHovered] = useState<number | null>(null);

	const geometry = useMemo(() => {
		if (series.length === 0) return null;

		const plotWidth = WIDTH - PADDING.left - PADDING.right;
		const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

		// L'échelle part toujours de zéro : tronquer la base exagère
		// visuellement les variations.
		const max = Math.max(...series.map((point) => point.revenue), 1);

		const x = (index: number) =>
			PADDING.left +
			(series.length === 1 ? plotWidth / 2 : (index / (series.length - 1)) * plotWidth);

		const y = (value: number) => PADDING.top + plotHeight - (value / max) * plotHeight;

		const points = series.map((point, index) => ({
			...point,
			x: x(index),
			y: y(point.revenue),
		}));

		const line = points.map((point) => `${point.x},${point.y}`).join(" ");
		const baseline = PADDING.top + plotHeight;
		const area = `${PADDING.left},${baseline} ${line} ${points[points.length - 1]!.x},${baseline}`;

		return { points, line, area, max, baseline };
	}, [series]);

	if (!geometry) {
		return (
			<p className="px-4 py-10 text-center text-[13px] text-muted">
				Aucune donnée sur la période.
			</p>
		);
	}

	const active = hovered === null ? null : geometry.points[hovered];

	return (
		<div className="relative">
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				className="w-full"
				style={{ height: HEIGHT }}
				role="img"
				aria-label={`Chiffre d'affaires quotidien sur ${series.length} jours`}
				onMouseLeave={() => setHovered(null)}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--chart-series)" stopOpacity="0.18" />
						<stop offset="100%" stopColor="var(--chart-series)" stopOpacity="0" />
					</linearGradient>
				</defs>

				{/* Grille discrète : trois repères suffisent à situer l'ordre de grandeur. */}
				{[0, 0.5, 1].map((ratio) => {
					const y = PADDING.top + (HEIGHT - PADDING.top - PADDING.bottom) * (1 - ratio);
					return (
						<line
							key={ratio}
							x1={PADDING.left}
							x2={WIDTH - PADDING.right}
							y1={y}
							y2={y}
							stroke="var(--chart-grid)"
							strokeWidth="1"
						/>
					);
				})}

				<polygon points={geometry.area} fill={`url(#${gradientId})`} />

				<polyline
					points={geometry.line}
					fill="none"
					stroke="var(--chart-series)"
					strokeWidth="2"
					strokeLinejoin="round"
					strokeLinecap="round"
				/>

				{active && (
					<>
						<line
							x1={active.x}
							x2={active.x}
							y1={PADDING.top}
							y2={geometry.baseline}
							stroke="var(--chart-grid)"
							strokeWidth="1"
						/>
						{/* Anneau à la couleur de la surface : le marqueur se détache
						    de la courbe qu'il survole. */}
						<circle
							cx={active.x}
							cy={active.y}
							r="4.5"
							fill="var(--chart-series)"
							stroke="var(--surface-raised)"
							strokeWidth="2"
						/>
					</>
				)}

				{/* Bandes de survol larges : viser un point de 2 px serait impraticable. */}
				{geometry.points.map((point, index) => (
					<rect
						key={point.date}
						x={point.x - (WIDTH - PADDING.left - PADDING.right) / series.length / 2}
						y={0}
						width={(WIDTH - PADDING.left - PADDING.right) / series.length}
						height={HEIGHT}
						fill="transparent"
						onMouseEnter={() => setHovered(index)}
					/>
				))}
			</svg>

			{active && (
				<div
					className="pointer-events-none absolute top-1 z-10 min-w-36 -translate-x-1/2 rounded-md border border-line bg-raised px-2.5 py-1.5 shadow-lg"
					style={{ left: `${(active.x / WIDTH) * 100}%` }}
				>
					<p className="text-[11px] text-subtle">
						{new Intl.DateTimeFormat("fr-FR", {
							day: "numeric",
							month: "short",
						}).format(new Date(active.date))}
					</p>
					<p className="text-[13px] font-semibold text-ink">
						{formatMoney(active.revenue, currency)}
					</p>
					<p className="text-[12px] text-muted">
						{formatNumber(active.orders)} commande{active.orders > 1 ? "s" : ""}
					</p>
				</div>
			)}

			<div className="flex justify-between px-2 text-[11px] text-subtle tabular">
				<span>
					{new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
						new Date(series[0]!.date),
					)}
				</span>
				<span>
					{new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
						new Date(series[series.length - 1]!.date),
					)}
				</span>
			</div>
		</div>
	);
};
