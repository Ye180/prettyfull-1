import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import ProductForm from "@/features/product/components/form-product";
import dynamic from "next/dynamic";
// Ajout de useState, useEffect, useCallback
import { useRouter } from "next/router"; // Pour la redirection
import { Fragment } from "react";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";

// Charger ReactQuill dynamiquement côté client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddProduct = () => {
	// Renommé pour correspondre au nom de fichier
	const originalUrl = useHostname();
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
	const router = useRouter(); // Hook pour la redirection

	return (
		<Fragment>
			<Layout
				title="Add Product"
				description="Add Product Desc"
				dashboard={true}
			>
				{/* --- Formulaire encapsulé par <form> --- */}
				<div>
					<SecTop
						title="Ajouter un produit"
						subtitle={"Pour enregistrer les produits de votre boutique."}
					>
						{/* Boutons du header */}
						<div className="flex items-center gap-3">
							<button
								type="button" // Important pour ne pas soumettre
								onClick={() => router.push("/product-list")} // Action Annuler
								className="inline-block px-3 py-2 rounded-lg bg-white text-Malertserror border border-gray-200 hover:bg-red-50" // Style Annuler
							>
								<p className="font-medium text__14">Retour</p>
							</button>
						</div>
					</SecTop>

					<section className="pt-0 pb-4">
						<Container>
							<ProductForm />
						</Container>
					</section>
				</div>{" "}
				{/* Fin du tag form */}
				{/* <InputForm /> */}
			</Layout>
		</Fragment>
	);
};

export default AddProduct; // Export renommé
