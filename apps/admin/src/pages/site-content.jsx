import Layout from "@/Components/Layout/Layout";
import { Fragment } from "react";

const SiteContent = () => {
	return (
		<Fragment>
			<Layout
				title="Site Content"
				description="Site Content Desc"
				dashboard={true}
			>
				<div>Site content</div>
			</Layout>
		</Fragment>
	);
};

export default SiteContent;
