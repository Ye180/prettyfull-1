"use client";
import { cn, data_url, formatCurrency_FR } from "@prettyfull/utils";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { AddToCardIcon } from "./icons/add.cart.icon";
import { Heart } from "./icons/heart.icon";

const cardVariants = cva(["space-y-3 w-[100%] h-full relative"], {
  variants: {
    variant: {
      default: "tracking-wide  cursor-pointer",
    },
    size: {
      default: " ",
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
    color: { label: string; code: string };
    size: string[];
    image: Array<string>;
    quantity: number;
  }[];
  notVariable?: {
    color?: { label: string; code: string };
    size: string[];
    image: string;
    quantity: number;
  };
  small_description?: string;
  price: number;
  solde?: boolean;
  promotion?: {
    reduced_price: number;
    pourcentage: number;
  };
  isLoading?: boolean;
}
export function CardProduct({
  title,
  className,
  small_description,
  price,
  children,
  promotion,
  solde,
  variable,
  notVariable,
  isLoading,
  ...props
}: CardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Préchargement des images
  useEffect(() => {
    if (variable) {
      const loadImages = async () => {
        const loadPromises = variable.map((variant, index) => {
          return new Promise<boolean>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src =
              typeof variant.image[0] === "string" ? variant.image[0] : "src";
          });
        });

        const results = await Promise.all(loadPromises);
        setImagesLoaded(results);
      };

      loadImages();
    }
  }, [variable]);

  return (
    <article className={cn(cardVariants(), className)} {...props}>
      <div className="bg-sky-200 h-[80%] md:hover:[&>div]:opacity-100 flex  justify-center items-center relative">
        {/* L'affichage d'un produit avec un produits variable */}
        {variable?.map((variant, i) => (
          <Image
            key={i}
            src={variant.image[0] as string}
            alt={`Product Image ${i + 1}`}
            width={800}
            height={800}
            className={cn(
              "object-cover w-full h-full absolute inset-0 transition-opacity duration-300",
              i === activeIndex ? "opacity-100" : "opacity-0"
            )}
            priority={i === 0}
            placeholder="blur"
            blurDataURL={data_url}
          />
        ))}
        {/* Fallback si pas de produit */}
        {!variable && notVariable?.image && (
          <Image
            src={notVariable.image}
            alt="Product Image"
            width={400}
            height={400}
            className="object-cover w-full h-full absolute inset-0 transition-opacity duration-300"
            priority
            placeholder="blur"
            blurDataURL={data_url}
          />
        )}

        <div className="absolute opacity-0 bottom-5  transition-all duration-300 ease-in-out w-full flex gap-8  px-4 justify-between items-center ">
          <Button className="pt-4 pb-5 px-4 w-2/3 text-[1.4rem] font-medium">
            Ajouter au panier
          </Button>
          <button className=" w-fit bg-secondary p-4 text-2xl  rounded-full cursor-pointer">
            <Heart />
          </button>
        </div>
        <button className="bg-white right-2 bottom-5 w-fit p-2 text-2xl absolute rounded-full md:hidden  cursor-pointer">
          <AddToCardIcon />
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm  max-sm:hidden capitalize text-grey  tracking-[0.03em] font-light">
          {small_description}
        </p>
      </div>
      <div className="flex justify-between items-start text-[#000] max-md:text-[2rem]  md:text-[2.7rem]">
        <h3 className="tracking-[0.03em] truncate line-clamp-1"> {title}</h3>

        {/* Correction de l'affichage des promotions */}
        {!promotion && <h4> {formatCurrency_FR(price)}</h4>}
        {promotion && (
          <>
            <div className="block text-end ">
              <h4> {formatCurrency_FR(promotion.reduced_price || 0)}</h4>
              <h4 className="text-grey/50 text-2xl line-through max-md:text-[2rem]  md:text-[2.7rem]">
                {formatCurrency_FR(price)}
              </h4>
            </div>
            <span className="text-black font-semibold text-[1rem] lg:text-xs bg-light absolute top-4 right-4 px-4 py-2 rounded-full">
              {promotion.pourcentage}% OFF
            </span>
          </>
        )}
      </div>
      <div className="flex justify-start gap-2 items-center">
        {variable?.map((variant, i) => (
          <button
            key={i}
            className={cn(
              "h-fit w-fit p-[2px] border bg-white flex justify-center items-center rounded-full transition-all duration-200",
              i === activeIndex ? "border-black shadow-md" : "border-gray-300"
            )}
            onClick={() => setActiveIndex(i)}
          >
            <span
              className={cn("h-5 w-5 rounded-full cursor-pointer")}
              style={{ backgroundColor: variant.color.code }}
            ></span>
          </button>
        ))}
      </div>
    </article>
  );
}
