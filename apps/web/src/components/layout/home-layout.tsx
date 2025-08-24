import { PropsWithChildren } from "react";

interface HomeLayoutProps {
  settings: {
    theme: string;
    language: string;
  };
}

const HomeLayout = ({
  children,
  settings,
}: PropsWithChildren<HomeLayoutProps>) => {
  return <div>{children}</div>;
};

export default HomeLayout;
