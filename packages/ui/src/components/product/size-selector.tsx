"use client";

// =============================================================================
// SizeSelector : Sélecteur de tailles sous forme de boutons
// =============================================================================

import React from "react";
import { cn } from "@prettyfull/utils";
import { Button } from "../../button";

interface SizeSelectorProps {
  /** Liste des tailles disponibles */
  sizes: string[];
  /** Taille actuellement sélectionnée */
  selectedSize: string | null;
  /** Callback appelé lors de la sélection d'une taille */
  onChange: (size: string) => void;
  /** Afficher en mode compact (pour les cartes) */
  compact?: boolean;
  onClick?: (e: React.MouseEvent, size: string) => void;
}

const sizeOptions = [
  {
    label: "XS",
    code: "XS",
  },
  {
    label: "S",
    code: "S",
  },
  {
    label: "M",
    code: "M",
  },
  {
    label: "L",
    code: "L",
  },
  {
    label: "XL",
    code: "XL",
  },
  {
    label: "2XL",
    code: "2XL",
  },
  {
    label: "3XL",
    code: "3XL",
  },
];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onChange,
  onClick,
  compact = false,
}) => {
  if (!sizes.length) return null;

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-6 justify-between items-center">
      {sizeOptions.map((size) => (
        <Button
          key={size.label}
          disabled={!sizes.includes(size.code)}
          type="button"
          onClick={(e) => {
            onClick?.(e, size.code);
            onChange(size.code);
          }}
          className={cn(
            "flex   w-full  text-center  h-14 px-4 pb-4 pt-3  mx-auto font-normal text-gray-600 uppercase bg-white border border-gray-300 rounded-sm text-[1.3rem] hover:border-black hover:text-black transition-all duration-200 cursor-pointer active:bg-white hover:bg-white active:text-white",
            compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
            selectedSize === size.code
              ? "border-black text-black"
              : "border-gray-300"
          )}
        >
          {size.label}
        </Button>
      ))}
    </div>
  );
};

export default SizeSelector;
