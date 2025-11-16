import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableProducts from "@/features/product/table/data-table";
import "flag-icons/css/flag-icons.min.css";
import Link from "next/link";
// Supprimer l'import useState initial si plus utilisé directement ici pour les données statiques
// import { Fragment, useState } from "react";
// Ajouter useEffect, useCallback
import { Fragment } from "react";
import { Container } from "react-bootstrap";

const ProductList = () => {
	const originalUrl = useHostname();
	// Utiliser l'URL de base de l'API depuis les variables d'environnement

	return (
		<Fragment>
			<Layout
				title="Liste des produits"
				description="Product List Desc"
				dashboard={true}
			>
				<SecTop
					title="Produits"
					subtitle={
						"Surveillez les produits de votre boutique pour augmenter vos ventes."
					}
				>
					<div className="flex items-center gap-3">
						{/* Les boutons restent */}
						<div
							// Utilise le bon handler
							className="inline-block px-3 py-2 text-white bg-black rounded-lg cursor-pointer"
						>
							<Link
								href="/products/add-product" // Lien vers la page d'ajout
								className="flex items-center gap-2 py-1 font-semibold text-white text__14"
							>
								Ajouter un produit
							</Link>
						</div>
					</div>
				</SecTop>

				<section className="pt-0 pb-4">
					<Container className="py-8 ">
						<DataTableProducts />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default ProductList;
