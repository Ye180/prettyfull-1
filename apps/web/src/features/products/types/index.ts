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


export type ProductVariable = {
    color: { label: string; code: string };
	size: string[];
	image:string[] | StaticImport[];
	quantity: number;
};

export type ProductTypes = {
    category?: string;
    title: string;
    price: number;
    description: string;
    solde?: boolean;
    
    promotion?: {
        reduced_price: number;
        pourcentage: number;
    };
    variable: ProductVariable[]; // On remplace sizes, colors, images par les variantes
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