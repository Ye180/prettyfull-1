import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableProducts from "@/features/product/table/data-table";
import "flag-icons/css/flag-icons.min.css";
// Supprimer l'import useState initial si plus utilisé directement ici pour les données statiques
// import { Fragment, useState } from "react";
// Ajouter useEffect, useCallback
import { Fragment } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const ProductList = () => {
	const originalUrl = useHostname();
	// Utiliser l'URL de base de l'API depuis les variables d'environnement

	return (
		<Fragment>
			<Layout
				title="Product List"
				description="Product List Desc"
				dashboard={true}
			>
				<SecTop
					title="Products"
					subtitle={"Monitor your store's products to increase your sales."}
				>
					<div className="flex items-center gap-3">
						{/* Les boutons restent */}
						<a
							href="#!" // TODO: Implémenter la logique d'export
							className="inline-block px-3 py-2 rounded-lg bg-Msurfacesurfacesecondary text-Mmaincolorgreen"
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/export.svg"} />
								<p className="font-medium text__14">Export</p>
							</div>
						</a>
						<a
							href="/add-product" // Lien vers la page d'ajout
							className="inline-block px-3 py-2 text-white bg-black rounded-lg" // Style différent pour bouton principal ?
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/pluss.svg"} />
								<p className="font-medium text__14">Add Product</p>
							</div>
						</a>
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
