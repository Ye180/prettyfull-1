import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableProducts from "@/features/product/table/data-table";
import "flag-icons/css/flag-icons.min.css";
// Supprimer l'import useState initial si plus utilisé directement ici pour les données statiques
// import { Fragment, useState } from "react";
// Ajouter useEffect, useCallback
import { Fragment, useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const ProductList = () => {
	const originalUrl = useHostname();
	// Utiliser l'URL de base de l'API depuis les variables d'environnement
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	// --- NOUVEAUX ÉTATS ---
	const [products, setProducts] = useState([]); // Pour stocker les produits de l'API
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// --- FIN NOUVEAUX ÉTATS ---

	// États existants pour les filtres (conservés)
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState(""); // Renommé pour clarté
	const [categoryFilter, setCategoryFilter] = useState(""); // Renommé pour clarté
	const [stockFilter, setStockFilter] = useState(""); // Renommé pour clarté

	// --- FONCTION POUR RÉCUPÉRER LES PRODUITS ---
	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// Utiliser l'API_BASE_URL et l'endpoint correct (probablement /products)
			const response = await fetch(`${API_BASE_URL}/products`); // Assurez-vous que '/products' est le bon endpoint
			if (!response.ok) {
				throw new Error(`Erreur récupération produits (${response.status})`);
			}
			const data = await response.json();
			// Assurez-vous que 'data' contient bien le tableau de produits
			// Si l'API retourne un objet { data: [...] }, utilisez data.data
			if (Array.isArray(data)) {
				setProducts(data);
			} else if (data && Array.isArray(data.data)) {
				// Gérer le cas où les données sont dans une propriété "data"
				setProducts(data.data);
			} else {
				console.warn("Format de données inattendu reçu de l'API:", data);
				setProducts([]); // Fallback à un tableau vide
			}
		} catch (err) {
			console.error("Erreur fetch produits:", err);
			setError(err.message);
			setProducts([]); // Assure un tableau vide en cas d'erreur
		} finally {
			setLoading(false);
		}
	}, [API_BASE_URL]);

	// --- LANCER LA RÉCUPÉRATION AU MONTAGE ---
	useEffect(() => {
		if (API_BASE_URL) {
			// Attendre que l'URL soit disponible
			fetchProducts();
		} else {
			setError("L'URL de l'API n'est pas configurée.");
			setLoading(false);
		}
	}, [fetchProducts, API_BASE_URL]); // Dépendance à fetchProducts et API_BASE_URL
	// --- FIN LOGIQUE DE RÉCUPÉRATION ---

	// Données statiques supprimées (dataTable n'est plus nécessaire)
	// const dataTable = [ ... ];

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
							className="inline-block px-3 py-2 rounded-lg bg-black text-white" // Style différent pour bouton principal ?
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/pluss.svg"} />
								<p className="font-medium text__14">Add Product</p>
							</div>
						</a>
					</div>
				</SecTop>

				<section className="pt-0 pb-4">
					<Container className=" py-8 ">
						<DataTableProducts />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default ProductList;
