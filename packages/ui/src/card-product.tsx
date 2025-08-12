import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { VariantProps, cva } from "class-variance-authority";

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
  ...props
}: CardProps) {
  return (
    <article className={cn(cardVariants(), className)} {...props}>
      <div className="bg-sky-200  h-3/4 flex justify-center items-center">
        {children}
      </div>
      <div className="space-y-3">
        <p className="text-lg lg:text-xl capitalize text-grey tracking-[0.03em] font-light">
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
              <h4 className="text-grey/50 text-3xl line-through">
                {formatCurrency_FR(promotion.reduced_price || 0)}
              </h4>
            </div>
            <span className="text-black font-semibold text-[1rem] lg:text-lg bg-light absolute top-4 right-4 px-4  py-2 rounded-full">
              {promotion.pourcentage}% OFF
            </span>
          </>
        )}

        {}
      </div>
    </article>
  );
}

///Example of product

// <CardProduct
//   price={12000}
//   promotion={{
//     pourcentage: 50,
//     reduced_price: 6000,
//   }}
//   small_description="Top polyvalente á Manche"
//   title="Sweet-Top"
// >
//   <Image
//     src="/assets/product_1.jpg"
//     alt="Sweet-Top"
//     width={6000}
//     height={6000}
//     className="object-cover w-full h-full "
//     priority
//   />
// </CardProduct>;
