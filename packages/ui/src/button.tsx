import "./styles.css";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

const buttonVariants = cva(
  "ui:inline-flex ui:items-center ui:justify-center ui:rounded-md  ui:font-medium ui:transition-colors ui:focus:outline-none ui:focus:ring-2 ui:focus:ring-slate-400 ui:focus:ring-offset-2 ui:disabled:opacity-50 ui:disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "ui:bg-blue-1000 ui:text-white ui:hover:bg-slate-700",
        destructive: "ui:bg-red-500 ui:text-white ui:hover:bg-red-600",
        outline: "ui:border ui:border-slate-200 ui:hover:bg-slate-100",
        secondary: "ui:bg-slate-100 ui:text-slate-900 ui:hover:bg-slate-200",
        ghost: "ui:hover:bg-slate-100",
        link: "ui:underline-offset-4 ui:hover:underline text-slate-900",
      },
      size: {
        default: "ui:h-10 ui:py-2 ui:px-4",
        sm: "ui:h-9 ui:px-3 ui:rounded-md",
        lg: "ui:h-11 ui:px-8 ui:rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  children,
  className,
  variant,
  size,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
};
