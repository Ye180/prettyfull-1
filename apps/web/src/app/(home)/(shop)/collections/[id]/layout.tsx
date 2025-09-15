import { PropsWithChildren } from "react";
import CollectionLayout from "../../../../../../../../packages/ui/src/layouts/collection-layout";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <CollectionLayout children={children} />;
};

export default RootLayout;
