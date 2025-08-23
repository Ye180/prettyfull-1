"use client";

import { cn } from "@prettyfull/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
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
  const [styleGrid, setStyleGrid] = useState<{ style: Object; active: number }>(
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "2rem",
        "& > div": {
          height: "60rem",
        },
      },
      active: 4,
    }
  );

  const responsive =
    "max-lg:grid-cols-3 max-lg:[&>div]:h-[75rem] max-md:[&>div]:h-[55rem] max-md:grid-cols-3  max-sm:grid-cols-2  max-sm:[&>div]:h-[50rem] max-xs:[&>div]:h-[30rem]";

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
      return "grid grid-cols-3 gap-x-8 gap-y-8 [&>div]:h-[75rem]";
    }

    if (styleGrid.active === 4) {
      return "grid grid-cols-4 gap-x-8 gap-y-8 [&>div]:h-[60rem]";
    }

    if (styleGrid.active === 5) {
      return "grid grid-cols-5 gap-x-8 gap-y-8 [&>div]:h-[55rem]";
    }
  }, [styleGrid]);

  const gridClasses = useMemo(
    () => cn("", handleStyles(), responsive, grid_card),
    [responsive, grid_card, handleStyles]
  );

  return (
    <div
      className={cn(gridVariants(), "text-black  space-y-8", className)}
      {...props}
    >
      {action_grid && (
        <div className="text-black  hidden lg:flex lg:justify-end gap-4 ">
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
        </div>
      )}

      <div className={cn(gridClasses)}>{children}</div>
    </div>
  );
};
