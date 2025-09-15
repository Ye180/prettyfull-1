import { PropsWithChildren } from "react";
import HomeLayout from "../../../../../packages/ui/src/layouts/home-layout";

const HomeRootLayout = ({ children }: PropsWithChildren<{}>) => {
  return <HomeLayout children={children} />;
};

export default HomeRootLayout;
