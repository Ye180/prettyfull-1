import { PropsWithChildren } from "react";
import CollectionLayout from "../../../../../components/layout/collection-layout";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <CollectionLayout children={children} />;
};

export default RootLayout;
