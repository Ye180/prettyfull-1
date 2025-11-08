// export type ProductTypes = {
//     category: string;
//     title: string;
//     price: number;
//     description: string;
//     sizes: {
//         label: string;
//         value: string;
//     }[];
//     colors: {
//         name: string;
//         code: string;
//     }[];
//     images: string[];

import { StaticImport } from "next/dist/shared/lib/get-img-props";

// }
// --- Type TProduct (Corrigé et Ajouté) ---
// C'est le type principal que vos composants et appels API utiliseront.
// Il est basé sur le schéma de votre backend (product.schema.ts)
export type TProduct = {
  _id: string; // ID de la base de données

  slug: string;
  
  price: {
    amount: number;
    currency: string;
  };
  
  categories: any[]; // Devrait être un tableau d'objets Catégorie
  stock: number;
  mainImageUrl?: string; // L'image principale
  images?: string[]; // Autres images

  // Gère les options (pour le composant ProductOptions)
  // À adapter selon la structure réelle de vos options
  options?: {
     sizes?: string[];
     colors?: { name: string; code: string }[];
  };

  solde?: boolean;
  promotion?: {
    reduced_price: number;
    pourcentage: number;
  };
  
  // Gérer les variantes si vous les utilisez
  notVariable?: ProductVariable;
  variable?: ProductVariable[];
};

export type ProductVariable = {
    color: { label: string; code: string };
	size: string[];
	image:string[] | StaticImport[];
	quantity: number;
};

export type ProductTypes = {
    category?: string;
    name: string;
    price: {
        amount: number;
        currency: string;
    };
    description: string;
    solde?: boolean;
    
    promotion?: {
        reduced_price: number;
        pourcentage: number;
    };
	notVariable?:ProductVariable; // Pour les produits sans variantes,

    variable?: ProductVariable[]; // On remplace sizes, colors, images par les variantes
};

// export interface CardProps {
//     title: string;
//     link?: string;
//     variable?: {
//         color: { label: string; code: string };
//         size: string[];
//         image: Array<string>;
//         quantity: number;
//     }[];
//     notVariable?: {
//         color?: { label: string; code: string };
//         size: string[];
//         image: string;
//          quantity?: number;
//     };
//     smallDescription?: string;
//     price: number;
//     solde?: boolean;
//     promotion?: {
//         reduced_price: number;
//         pourcentage: number;
//     };
//     isLoading?: boolean;
//     label?: string;
// }