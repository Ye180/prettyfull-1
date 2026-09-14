import type {
	Address,
	AddressInput,
	Banner,
	ContactMessageInput,
	CategoryNode,
	FeaturedEntry,
	Order,
	Paginated,
	PaginationMeta,
	Product,
	ShippingOption,
	StaticPage,
	User,
} from "@prettyfull/contracts";
import { storeApi, toQuery } from "./client";
import {
	toRawProduct,
	toStoreBanner,
	toStoreCategory,
	toStoreOrder,
	toStoreProduct,
	toStoreShippingOption,
} from "./adapters";
import type { StoreCategory, StoreProduct, StoreRegion } from "./types";

/**
 * Accès aux données du storefront.
 *
 * Chaque fonction interroge `/api/store` puis passe par un adaptateur : les
 * appelants ne manipulent que des formes d'affichage.
 */

// --- Catalogue -------------------------------------------------------------

export interface FetchProductsParams {
	limit?: number;
	page?: number;
	sort?: string;
	order?: "asc" | "desc";
	categorySlug?: string;
	categoryId?: string;
	q?: string;
	minPrice?: number;
	maxPrice?: number;
	isFeatured?: boolean;
	tag?: string;
	stockStatus?: string;
}

/** Liste paginée : le total/`hasNext` viennent du backend, pas recalculés côté client. */
export const fetchProducts = async (
	params: FetchProductsParams = {},
): Promise<{ products: StoreProduct[]; meta: PaginationMeta }> => {
	const response = await storeApi.get<Paginated<Product>>(
		`/api/store/products${toQuery({ limit: 20, ...params })}`,
	);

	return { products: response.data.map(toStoreProduct), meta: response.meta };
};

/**
 * Même requête que `fetchProducts`, mais renvoyée dans la forme « brute »
 * attendue par `normalizeCollectionProducts`/`normalizeStandaloneProducts` de
 * `@prettyfull/ui` (voir `toRawProduct`) - c'est ce que consomment les
 * grilles produit (`CardProduct`/`GridCardProduct`), pas `StoreProduct`.
 */
export const fetchProductsRaw = async (
	params: FetchProductsParams = {},
): Promise<{ products: ReturnType<typeof toRawProduct>[]; meta: PaginationMeta }> => {
	const response = await storeApi.get<Paginated<Product>>(
		`/api/store/products${toQuery({ limit: 20, ...params })}`,
	);

	return { products: response.data.map(toRawProduct), meta: response.meta };
};

export const fetchProductByHandle = async (
	handle: string,
): Promise<StoreProduct | null> => {
	try {
		const product = await storeApi.get<Product>(
			`/api/store/products/${encodeURIComponent(handle)}`,
		);
		return toStoreProduct(product);
	} catch {
		// Un produit dépublié ou inexistant se traduit par « pas de fiche »,
		// pas par une page en erreur.
		return null;
	}
};

export const fetchProductsByCategory = async (
	categorySlug: string,
	params: { limit?: number } = {},
): Promise<StoreProduct[]> => {
	const response = await storeApi.get<Paginated<Product>>(
		`/api/store/categories/${encodeURIComponent(categorySlug)}/products${toQuery({ limit: 100, ...params })}`,
	);

	return response.data.map(toStoreProduct);
};

/**
 * Arbre des rayons, enrichi des clés de section.
 *
 * Les deux requêtes partent ensemble : la page d'accueil a besoin des deux
 * pour son premier rendu, et les enchaîner doublerait son temps d'attente.
 */
export const fetchCategoryTree = async (): Promise<StoreCategory[]> => {
	const [tree, featured] = await Promise.all([
		storeApi.get<CategoryNode[]>("/api/store/categories?tree=true"),
		storeApi
			.get<FeaturedEntry[]>("/api/store/featured")
			.catch(() => [] as FeaturedEntry[]),
	]);

	const sectionKeys = new Map(
		featured.flatMap((entry) =>
			entry.kind === "category" && entry.categoryId
				? [[entry.categoryId, entry.sectionKey] as const]
				: [],
		),
	);

	return tree.map((node) => toStoreCategory(node, sectionKeys));
};

/** Rayons à plat : les rangées de la page d'accueil et le menu s'en servent. */
export const fetchCategories = async (): Promise<StoreCategory[]> => {
	const tree = await fetchCategoryTree();

	const flatten = (nodes: StoreCategory[]): StoreCategory[] =>
		nodes.flatMap((node) => [
			node,
			...(node.category_children ? flatten(node.category_children) : []),
		]);

	// La racine « Boutique » n'est pas un rayon vendable : elle sert de
	// conteneur de navigation et n'a pas sa place dans une grille de rayons.
	return flatten(tree).filter((category) => !category.category_children);
};

// --- Contenu ---------------------------------------------------------------

export const fetchBanners = async (placement?: string) => {
	const banners = await storeApi.get<Banner[]>(`/api/store/banners${toQuery({ placement })}`);
	return banners.map(toStoreBanner);
};

export const fetchStaticPage = async (slug: string): Promise<StaticPage | null> => {
	try {
		return await storeApi.get<StaticPage>(`/api/store/pages/${encodeURIComponent(slug)}`);
	} catch {
		return null;
	}
};

// --- Configuration ---------------------------------------------------------

interface StoreConfig {
	storeName: string;
	defaultCurrency: string;
	enabledCurrencies: string[];
	defaultLocale: string;
	enabledLocales: string[];
	maintenanceMode: boolean;
}

export const fetchConfig = (): Promise<StoreConfig> =>
	storeApi.get<StoreConfig>("/api/store/config");

/**
 * Régions dérivées des devises activées dans le back-office.
 *
 * Le modèle n'a pas de notion de région ; le storefront en a besoin pour son
 * sélecteur de devise, on la synthétise donc plutôt que d'ajouter une entité
 * qui ne servirait qu'à l'affichage.
 */
const CURRENCY_LABELS: Record<string, string> = {
	xof: "Afrique de l'Ouest (FCFA)",
	eur: "Europe (EUR)",
	usd: "International (USD)",
};

export const fetchRegions = async (): Promise<StoreRegion[]> => {
	const config = await fetchConfig();

	return config.enabledCurrencies.map((currency) => ({
		id: `reg_${currency}`,
		name: CURRENCY_LABELS[currency] ?? currency.toUpperCase(),
		currency_code: currency,
	}));
};

export const fetchPaymentOptions = () =>
	storeApi.get<{ key: string; name: string; description: string | null }[]>(
		"/api/store/payment-options",
	);

// --- Commandes -------------------------------------------------------------

export const fetchOrders = async () => {
	const response = await storeApi.get<Paginated<Order>>("/api/store/orders?limit=50", false);
	return { orders: response.data.map(toStoreOrder), count: response.meta.total };
};

export const fetchOrderById = async (orderId: string) => {
	const order = await storeApi.get<Order>(`/api/store/orders/${orderId}`, false);
	return toStoreOrder(order);
};

/**
 * Confirmation d'une commande passée sans compte.
 *
 * Le jeton signé, renvoyé au passage en commande, tient lieu d'autorisation :
 * une commande invité doit rester consultable par son auteur.
 */
export const fetchOrderConfirmation = async (orderId: string, token: string) => {
	const order = await storeApi.get<Order>(
		`/api/store/orders/${orderId}/confirmation${toQuery({ token })}`,
	);
	return toStoreOrder(order);
};

export const cancelOrder = async (orderId: string, reason?: string) => {
	const order = await storeApi.post<Order>(`/api/store/orders/${orderId}/cancel`, {
		reason,
	});
	return toStoreOrder(order);
};

export const fetchShippingOptions = async () => {
	const options = await storeApi.get<ShippingOption[]>(
		"/api/store/cart/shipping-options",
		false,
	);
	return options.map(toStoreShippingOption);
};

// --- Compte et carnet d'adresses (§2.7) ------------------------------------

export const fetchProfile = () => storeApi.get<User>("/api/store/auth/me", false);

export const updateProfile = (input: {
	firstName?: string;
	lastName?: string;
	phone?: string | null;
}) => storeApi.patch<User>("/api/store/auth/me", input);

export const fetchAddresses = () => storeApi.get<Address[]>("/api/store/addresses", false);

export const createAddress = (input: AddressInput) =>
	storeApi.post<Address>("/api/store/addresses", input);

export const updateAddress = (id: string, input: Partial<AddressInput>) =>
	storeApi.patch<Address>(`/api/store/addresses/${id}`, input);

export const deleteAddress = (id: string) =>
	storeApi.delete<{ success: boolean }>(`/api/store/addresses/${id}`);

// --- Contact ---------------------------------------------------------------

/**
 * Envoi d'un message depuis le formulaire de contact.
 *
 * Route publique : aucune session n'est requise, et aucun renouvellement de
 * jeton ne doit être tenté sur une éventuelle 401.
 */
export const sendContactMessage = (input: ContactMessageInput) =>
	storeApi.post<{ success: boolean; id?: string }>("/api/store/contact", input, true);
