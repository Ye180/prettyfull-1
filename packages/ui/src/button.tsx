import { cn } from "@prettyfull/utils";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Spinner } from "./icons/spinner.icon";
const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer  w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: " bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-black bg-background hover:bg-muted/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: " px-[4rem] py-[1.9rem]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({
  children,
  className,
  variant,
  size,
  shape,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const disabled = props.disabled || props.isLoading;

  return (
    <button
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
      disabled={disabled}
    >
      <div className="flex gap-3">
        {children}
        {props.isLoading && <Spinner />}
      </div>
    </button>
  );
};
