import Layout from "@/Components/Layout/Layout";
import SiteContentForm from "@/features/site-content/components/form-site-content";
import { Fragment } from "react";

const SiteContent = () => {
	return (
		<Fragment>
			<Layout
				title="Site Content"
				description="Site Content Desc"
				dashboard={true}
			>
				<div className="w-full p-4 rounded-md shadow-md ">
					<SiteContentForm />
				</div>
			</Layout>
		</Fragment>
	);
};

export default SiteContent;
