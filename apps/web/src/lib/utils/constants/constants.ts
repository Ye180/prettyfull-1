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
            title: "Product",
            links: [
                  { label: "Accessories", url: "/collections" },
                  { label: "Sneakers", url: "/collections" },
                  { label: "T-Shirts & Pants", url: "/collections" },
                  { label: "Jackets & Blazers", url: "/collections" },
            ],
      },
      {
            title: "Support",
            links: [
                  { label: "Support Center", url: paths.faq },
                  { label: "FAQs", url: paths.faq },
                  { label: "Troubleshooting", url: paths.faq },
                  { label: "Feedback", url: paths.contact },
            ],
      },
      {
            title: "Company",
            links: [
                  { label: "About Us", url: paths.about },
                  { label: "Careers", url: paths.about },
                  { label: "Blog", url: paths.about },
                  { label: "Contact", url: paths.contact },
            ],
      },
      {
            title: "Legal",
            links: [
                  { label: "Privacy Policy", url: paths.terms },
                  { label: "Terms of Service", url: paths.terms },
                  { label: "Cookie Policy", url: paths.terms },
                  { label: "Compliance", url: paths.terms },
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