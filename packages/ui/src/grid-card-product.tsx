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
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridVariants> {
	title?: string;
	className?: string;
	classGrid?: string;
	style_everst?: string;
	grid_card?: string;
	action_grid?: boolean;
	children: ReactElement<any, any>;
}

export const GridCardProduct = ({
	title,
	className,
	classGrid,
	children,
	grid_card,
	action_grid,
	...props
}: GridCardProductProps) => {
	const [styleGrid, setStyleGrid] = useState<{ style: Object; active: number }>(
		{
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
				gap: "0.5rem",
				"& > div": {
					// height: "60rem",
				},
			},
			active: 4,
		}
	);

	const responsive =
		"max-md:grid-cols-3 gap-x-[8px]  max-md:grid-cols-3  max-sm:grid-cols-2     ";
	// "z-0 mb-6 lg:mb-4 grid grid-cols-2 md:grid-cols-3 gap-x-[1px] md:gap-y-8 lg:grid-cols-4 lg:gap-x-2 lg:gap-y-8 3xl:grid-cols-5";
	// "max-md:grid-cols-3  max-md:[&>div]:h-[75rem]   max-md:grid-cols-3  max-sm:grid-cols-2 max-sm:gap-x-2  max-sm:[&>div]:h-[450px] max-xs:[&>div]:h-[400px] max-sm: space-y-45 sm:space-y-58 md:space-y-48 lg:space-y-52  ";

	// "z-0 mb-6 lg:mb-4 grid grid-cols-2 md:grid-cols-3 gap-x-[1px] md:gap-y-8 lg:grid-cols-4 lg:gap-x-2 lg:gap-y-8 3xl:grid-cols-5";

	const handleChangeStyle = useCallback(
		(style: Object, index: number) => {
			setStyleGrid({
				...styleGrid,
				active: index,
			});
			console.log(style);
		},
		[styleGrid]
	);

	const handleStyles = useCallback(() => {
		if (styleGrid.active === 3) {
			return "grid grid-cols-3 gap-x-8 gap-y-2 ";
		}

		if (styleGrid.active === 4) {
			return "grid grid-cols-4 gap-x-8 gap-y-2";
		}

		if (styleGrid.active === 5) {
			return "grid grid-cols-5 gap-x-8 gap-y-2 ";
		}
	}, [styleGrid]);

	const gridClasses = useMemo(
		() => cn("", handleStyles(), responsive, grid_card),
		[responsive, grid_card, handleStyles]
	);

	return (
		<div
			className={cn(gridVariants(), "text-black   space-y-4 ", className)}
			{...props}
		>
			{action_grid && (
				<div className="gap-4 space-x-5 text-black max-md:hidden md:flex md:justify-end md:items-center">
					<ToPull />
					<span className="flex items-center justify-center gap-4">
						{StyleBar.map((styles, index) => (
							<GridBar
								key={index}
								className={cn(
									styleGrid.active === styles.number ? "[&>span]:bg-black" : ""
								)}
								number={styles.number}
								onclick={() => handleChangeStyle(styles.style, styles.number)}
							/>
						))}
					</span>
				</div>
			)}

			<div
				className={cn("lg:space-y-10", gridClasses, classGrid, "produit")}
				style={{}}
			>
				{children}
			</div>
		</div>
	);
};
