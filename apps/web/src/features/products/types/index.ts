export type ProductTypes = {
    category: string;
    title: string;
    price: number;
    description: string;
    sizes: {
        label: string;
        value: string;
    }[];
    colors: {
        name: string;
        code: string;
    }[];
    images: string[];

}