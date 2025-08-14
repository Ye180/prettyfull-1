import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useState } from "react";

const cardVariants = cva(["space-y-3  relative"], {
  variants: {
    variant: {
      default: "tracking-wide bg-slate-100 cursor-pointer",
    },
    size: {
      default:
        "w-[21rem] lg:w-[28rem] h-[36rem] lg:h-[50rem] max-width-[40rem]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  variable?: {
    color: { couleur: string; code: string };
    size: Array<string>;
    image: Array<string>;
    quantity: number;
  }[];
  notVariable?: {
    color?: string;
    size: Array<string>;
    image: string;
    quantity: number;
  };
  small_description?: string;
  price: number;
  sold?: boolean;
  promotion?: {
    reduced_price: number;
    pourcentage: number;
  };
  imageSrc?: string;

  children?: React.ReactNode;
}
export function CardProduct({
  title,
  className,
  small_description,
  price,
  children,
  promotion,
  sold,
  variable,
  notVariable,
  ...props
}: CardProps) {
  const [activeVariable, setActiveVariable] = useState<string | null>(null);
  return (
    <article className={cn(cardVariants(), className)} {...props}>
      <div className="bg-sky-200  h-3/4 flex justify-center items-center">
        {children}
      </div>
      <div className="space-y-3">
        <p className="text-xs capitalize text-grey tracking-[0.03em] font-light">
          {small_description}
        </p>
      </div>
      <div className="flex justify-between items-start text-[#000] text-[2rem] lg:text-[2.5rem]">
        <h3 className="tracking-[0.03em]"> {title}</h3>

        {!promotion && <h4> {formatCurrency_FR(price)}</h4>}

        {promotion && (
          <>
            <div className="block text-end">
              <h4> {formatCurrency_FR(price)}</h4>
              <h4 className="text-grey/50 text-2xl line-through">
                {formatCurrency_FR(promotion.reduced_price || 0)}
              </h4>
            </div>
            <span className="text-black font-semibold text-[1rem] lg:text-xs bg-light absolute top-4 right-4 px-4  py-2 rounded-full">
              {promotion.pourcentage}% OFF
            </span>
          </>
        )}

        {}
      </div>
      <div className="flex justify-start gap-2 items-center">
        {variable?.map((variant, i) => (
          <button
            key={i}
            className="h-fit  w-fit p-[2px] border-1 border-b-black  bg-white flex justify-center items-center rounded-full"
          >
            <span
              role="button"
              tabIndex={0}
              onClick={() => console.log("viva")}
              className={cn(`h-5 w-5 rounded-full cursor-pointer`)}
              style={{ backgroundColor: variant.color.code }}
            ></span>
          </button>
        ))}
      </div>
    </article>
  );
}

///Example of product
