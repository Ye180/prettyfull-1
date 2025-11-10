// src/pages/category.jsx
import Layout from "@/Components/Layout/Layout";
import SecTop from "@/Components/Section/SecTop";
import DataTableCategory from "@/features/category/table/data-table";
import "flag-icons/css/flag-icons.min.css"; // Gardé si utilisé ailleurs
import Link from "next/link";
import { Fragment } from "react"; // Ajout Fragment
import { Container } from "react-bootstrap";

const Category = () => {
	// Définir l'URL de base de l'API
	const API_BASE_URL =
		process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Utilise la variable d'env

	return (
		<Fragment>
			<Layout title="Category" description="Category Desc" dashboard={true}>
				<SecTop
					title="Liste des catégories"
					subtitle="Gérez les catégories de votre boutique."
				>
					<div className="flex items-center gap-3">
						<div
							// Utilise le bon handler
							className="inline-block px-3 py-2 text-white bg-black rounded-lg cursor-pointer"
						>
							<Link className="flex items-center gap-2" href="/add-category">
								<p className="font-medium text-white text__14">
									Ajouter Catégorie
								</p>
							</Link>
						</div>
					</div>
				</SecTop>

				<section className="pt-0 pb-4">
					<Container className="py-8 ">
						<DataTableCategory />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Category; // Export avec majuscule
