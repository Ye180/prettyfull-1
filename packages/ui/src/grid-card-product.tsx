"use client";

import { cn } from "@prettyfull/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { ReactElement, useState } from "react";
import { StyleBar } from "../../utils/constants";
import GridBar from "./grid-bars";

const gridVariants = cva(["w-full "], {
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
  style_everst?: string;
  grid_card?: string;
  action_grid?: boolean;
  children: ReactElement<any, any>;
}

export const GridCardProduct = ({
  title,
  className,
  children,
  grid_card,
  action_grid,
  ...props
}: GridCardProductProps) => {
  const [styleGrid, setStyleGrid] = useState<{ style: string; active: number }>(
    {
      style: "grid-cols-4 gap-x-8 gap-y-8 [&>div]:h-[60rem]  ",
      active: 1,
    }
  );

  const responsive =
    "max-lg:grid-cols-3 max-lg:[&>div]:h-[75rem] max-md:[&>div]:h-[55rem] max-md:grid-cols-3  max-sm:grid-cols-2  max-sm:[&>div]:h-[50rem] max-xs:[&>div]:h-[30rem]";

  const handleChangeStyle = (style: string, index: number) => {
    setStyleGrid({
      ...styleGrid,
      style: style,
      active: index,
    });
    console.log(style);
  };
  return (
    <div
      className={cn(gridVariants(), "text-black  space-y-8", className)}
      {...props}
    >
      {action_grid && (
        <div className="text-black  hidden lg:flex lg:justify-end gap-4 ">
          {StyleBar.map((styles, i) => (
            <GridBar
              key={i}
              className={cn(styleGrid.active === i ? "[&>span]:bg-black" : "")}
              number={styles.number}
              onclick={() => handleChangeStyle(styles.style, i)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          `grid grid-cols-4 gap-2`,
          styleGrid.style,
          responsive,
          grid_card
        )}
      >
        {children}
      </div>
    </div>
  );
};
