"use client";

import { cn } from "@prettyfull/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { StyleBar } from "../../utils/constants";
import GridBar from "./grid-bars";
import ToPull from "./to-pull";

const gridVariants = cva(["w-full h-fit  "], {
	variants: {
		variant: {
			default: "",
		},
	},

	defaultVariants: {
		variant: "default",
	},
});

interface GridCardProductProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridVariants> {
	className?: string;
	classGrid?: string;
	style_everst?: string;
	grid_card?: string;
	action_grid?: boolean;
	/** Masque le sélecteur de tri décoratif, pour ne garder que les icônes de densité. */
	hideSort?: boolean;
	children: ReactElement | ReactElement[];
}

export const GridCardProduct = ({
	className,
	classGrid,
	children,
	grid_card,
	action_grid,
	hideSort,
	...props
}: GridCardProductProps) => {
	const [styleGrid, setStyleGrid] = useState<{ style: object; active: number }>(
		{
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
				gap: "0.5rem",
				"& > div": {
					// height: "60rem",
				},
			},
			active: 5,
		},
	);

	const responsive =
		"max-md:grid-cols-3 gap-x-[8px]  max-md:grid-cols-3  max-sm:grid-cols-2";

	const handleChangeStyle = useCallback(
		(style: object, index: number) => {
			setStyleGrid({
				...styleGrid,
				active: index,
			});
		},
		[styleGrid],
	);

	const handleStyles = useCallback(() => {
		if (styleGrid.active === 3) {
			return "grid grid-cols-3 gap-x-8 gap-y-2 ";
		}

		if (styleGrid.active === 4) {
			return "grid grid-cols-4 gap-x-8 gap-y-2 ";
		}

		if (styleGrid.active === 5) {
			return "grid grid-cols-5 gap-x-8 gap-y-2 ";
		}
	}, [styleGrid]);

	const gridClasses = useMemo(
		() => cn("", handleStyles(), responsive, grid_card),
		[responsive, grid_card, handleStyles],
	);

	return (
		<div
			className={cn(gridVariants(), "space-y-4 text-black", className)}
			{...props}
		>
			{action_grid && (
				<div className="gap-4 py-1 space-x-5 text-black max-md:hidden md:flex md:justify-end md:items-center">
					{!hideSort && <ToPull />}
					<span className="flex gap-4 justify-center items-center">
						{StyleBar.map((styles, index) => (
							<GridBar
								key={index}
								className={cn(
									styleGrid.active === styles.number
										? "[&>span]:bg-black h-fit"
										: "",
								)}
								number={styles.number}
								onclick={() => handleChangeStyle(styles.style, styles.number)}
							/>
						))}
					</span>
				</div>
			)}

			<div
				className={cn("lg:space-y-10", gridClasses, classGrid, "")}
				style={{}}
			>
				{children}
			</div>
		</div>
	);
};
