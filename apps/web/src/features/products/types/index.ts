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

// }


export type ProductVariant = {
    size: string;
    color: {
        name: string;
        code: string;
    };
    images: string[];
    stock: number; // 0 pour hors-stock
};

export type ProductTypes = {
    category: string;
    title: string;
    price: number;
    description: string;
    variants: ProductVariant[]; // On remplace sizes, colors, images par les variantes
};