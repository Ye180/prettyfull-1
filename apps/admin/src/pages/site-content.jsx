import Layout from "@/Components/Layout/Layout";
import SecTop from "@/Components/Section/SecTop";
import CardSiteContent from "@/features/site-content/components/card-content";
import Link from "next/link";
import { Fragment } from "react";
import { Container } from "react-bootstrap";

const SiteContent = () => {
	return (
		<Fragment>
			<Layout
				title="Site Content"
				description="Site Content Desc"
				dashboard={true}
			>
				<SecTop
					title="Contenu du site"
					subtitle="Gérez le contenu de votre site pour offrir une expérience engageante à vos visiteurs."
				>
					<div className="flex items-center gap-3 ">
						<div
							// Utilise le bon handler
							className="inline-block px-3 py-2 text-white bg-black rounded-lg cursor-pointer"
						>
							<Link className="flex items-center gap-2" href="/add-content">
								<p className="font-medium text-white text__14">
									Ajoutez un contenu
								</p>
							</Link>
						</div>
					</div>
				</SecTop>
				<section className="pt-0 pb-4">
					<Container className="flex flex-wrap py-8 ">
						<CardSiteContent />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default SiteContent;
