import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface HomeLayoutProps {
  className?: string;
}

const HomeLayout = ({
  children,
  className,
}: PropsWithChildren<HomeLayoutProps>) => {
  return (
    <>
      <header></header>
      <body className={cn(className)}>{children}</body>
    </>
  );
};

export default HomeLayout;
