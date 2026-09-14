/**
 * Le composant container :
 * Ce composant permet de définir un conteneur centré avec une largeur maximale.
 */

import { cn } from "@prettyfull/utils";
import type { HTMLAttributes, PropsWithChildren } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: `${number}px` | `${number}rem` | `${number}vw`;
  as?: "div" | "section" | "main" | "footer" | "header";
}

const Container = ({
  maxWidth = "140rem",
  as = "div",
  children,
  ...props
}: PropsWithChildren<ContainerProps>) => {
  const Component = as;
  return (
    <Component
      style={{ maxWidth }}
      className={cn(`mx-auto px-6 lg:px-10 xl:px-16`, props.className)}
    >
      {children}
    </Component>
  );
};

export default Container;
