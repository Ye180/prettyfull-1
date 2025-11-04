import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import { Button } from "@/components/ui/button";
import FormCategory from "@/features/category/components/form-category";
import dynamic from "next/dynamic";
// Ajout de useState, useEffect, useCallback
import { Fragment } from "react";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";

// Charger ReactQuill dynamiquement côté client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddProduct = () => {
	// Renommé pour correspondre au nom de fichier
	const originalUrl = useHostname();
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	return (
		<Fragment>
			<Layout
				title="Add Product"
				description="Add Product Desc"
				dashboard={true}
			>
				<div>
					<SecTop
						title="Ajouter une catégorie"
						subtitle={"Une nouvelle catégorie."}
					>
						{/* Boutons du header */}
						<div className="flex items-center gap-3">
							<Button
								// Bouton principal de soumission
								// Désactiver pendant le chargement
								className={`inline-block px-3 py-2 rounded-lg bg-black text-white `}
							>
								<div className="flex items-center gap-2">
									<p className="font-medium text__14">{"Add Product"}</p>
								</div>
							</Button>
						</div>
					</SecTop>

					<section className="pt-0 pb-4">
						<Container className=" py-8">
							<FormCategory />
						</Container>
					</section>
				</div>
			</Layout>
		</Fragment>
	);
};

export default AddProduct; // Export renommé
