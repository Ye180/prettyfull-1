import Layout from "@/Components/Layout/Layout";
import SecTop from "@/Components/Section/SecTop";
import { useGetAllSiteContents } from "@/features/site-content/api/get-site-contents";
import CardSiteContent from "@/features/site-content/components/molecules/card-content";
import Link from "next/link";
import { Fragment } from "react";
import { Container } from "react-bootstrap";

const SiteContent = () => {
	// Récupérer tous les contenus (pour admin)
	const { data: allContents, isLoading } = useGetAllSiteContents();

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
						<div className="inline-block px-3 py-2 text-white bg-black rounded-lg cursor-pointer">
							<Link
								className="flex items-center gap-2 py-1 font-semibold text-white text__14"
								href="/sites-content/add-content"
							>
								Ajouter un contenu
							</Link>
						</div>
					</div>
				</SecTop>
				<section className="pt-0 pb-4">
					<Container className="flex flex-wrap py-8 ">
						<CardSiteContent
							siteContents={allContents || []}
							isLoading={isLoading}
						/>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default SiteContent;
