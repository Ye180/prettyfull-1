import FacebookIcon from "@/components/icons/facebook.icon";
import InstagramIcon from "@/components/icons/instagram.icon";
import LinkedinIcon from "@/components/icons/linkedin.icon";
import TwitterIcon from "@/components/icons/twitter.icon";
import { BoxTypes } from "@/types/constants-type";
import { FC } from "react";
import { paths } from "../../routes/paths-en";

interface IconProps {
    className?: string;
    size?: number;
}

export const BOX_DATA_FIRST: BoxTypes[] = [
      {
            picture: "/home/arrivals-1.jpg",
            label: "For Woman",
      },
      {
            picture:  "/home/arrivals-3.jpg",
            label: "hot outfits",
      },
      {
            picture:  "/home/arrivals-4.jpg",
            label: "Tops & Tees",
      },
]



export const BOX_DATA_SECOND: BoxTypes[] = [
      {
            picture: "/home/cover-box-second-1.jpg",
            label: "SUMMER",
      },
      
      {
            picture: "/home/cover-box-second-3.jpg",
            label: "FASHION",
      },
      {
            picture: "/home/cover-box-second-4.jpg",
            label: "Gothic",
      },
       {
            picture: "/home/cover-box-second-5.jpg",
            label: "Sky Styles ",
      },
]

export const FOOTER_DATA = [
      {
            title: "Produits",
            links: [
                  { label: "Robes", url: "/collections/robes" },
                  { label: "Hauts", url: "/collections/hauts" },
                  { label: "Ensembles", url: "/collections/ensembles" },
                  { label: "Accessoires", url: "/collections/accessoires" },
            ],
      },
      {
            title: "Aide",
            links: [
                  { label: "Questions fréquentes", url: paths.faq },
                  { label: "Livraison & retours", url: paths.shippingReturn },
                  { label: "Suivre ma commande", url: paths.account },
                  { label: "Nous contacter", url: paths.contact },
            ],
      },
      {
            title: "À propos",
            links: [
                  { label: "Notre histoire", url: paths.about },
                  { label: "Contact", url: paths.contact },
            ],
      },
      {
            title: "Mentions légales",
            links: [
                  { label: "Conditions générales de vente", url: paths.terms },
                  { label: "Livraison & retours", url: paths.shippingReturn },
            ],
      },
];

export const SOCIALS_DATA_FOOTER: {
    label: string;
    href: string;
    icon: FC<IconProps>;
}[] = [
      { label: "Twitter", href: "#", icon: TwitterIcon },
      { label: "Facebook", href: "#", icon: FacebookIcon },
      { label: "Instagram", href: "#", icon: InstagramIcon },
      { label: "LinkedIn", href: "#", icon: LinkedinIcon },
]



export const DATA_CARD = [
	{
		id: "1",
		name: "Nike Form",
		description: "Dri-FIT Hooded Versatile Jacket",
		color: "Black",
		size: "L",
		price: 360,
		image: "/assets/product_1.jpg",
		quantity: 1,
	},
	{
		id: "2",
		name: "Nike Club",
		description: "Men's Short-Sleeve Polo",
		color: "White",
		size: "M",
		price: 38,
		image: "/assets/product_2.webp",
		quantity: 75,
	},
];



export const BOX_CATEGORY: BoxTypes[] = [
      {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL1",
      },
      
      {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL2",
      },
      {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL3",
      },
      {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL4",
      },
       {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL5",
      },
        {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL5",
      },
       {
            picture: "/category/category1.jpg",
            label: "PRETTYFULL6",
      },
]