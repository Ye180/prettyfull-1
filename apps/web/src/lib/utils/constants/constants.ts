import FacebookIcon from "@/components/icons/facebook.icon";
import InstagramIcon from "@/components/icons/instagram.icon";
import LinkedinIcon from "@/components/icons/linkedin.icon";
import TwitterIcon from "@/components/icons/twitter.icon";
import { BoxTypes } from "@/types/constants-type";
import { FC } from "react";
import { COLLECTION_PATHS, paths } from "../../routes/paths-en";

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
            "title": "SHOP",
            "links": [
                  { "label": "Woman", "url": "/shop/woman" },
                  { "label": "Man", "url": "/shop/man" },
                  { "label": "Divided", "url": "/shop/divided" },
                  { "label": "Baby", "url": "/shop/baby" },
                  { "label": "Children", "url": "/shop/children" }
            ]
      },
      {
            "title": "HELP",
            "links": [
              { "label": "About Prettyfull", "url": "/help/about-snaely" },
                  { "label": "Contact", "url": paths.contact },
                  { "label": "FAQ", "url": paths.faq },
                  { "label": "Terms & Conditions", "url": paths.terms },
                  { "label": "Shipping & Return", "url": paths.shippingReturn },
                 
                
            ]
      },
      {
            "title": "ABOUT",
            "links": [
                  { "label": "Just Arrived", "url": "/about/just-arrived" },
                  { "label": "Customization", "url": "/about/customization" },
                  { "label": "Shop by Look", "url": "/about/shop-by-look" },
                  { "label": "Wedding", "url": "/about/wedding" },
                  { "label": "About Snaely", "url": "/about/about-snaely" }
            ]
      }
];

export const NAV_LINKS = [
  { href: COLLECTION_PATHS.collectionDetail('women'), label: "Women" },
  { href: COLLECTION_PATHS.collectionDetail('plus-curve'), label: "Plus+Curve" },
  { href: COLLECTION_PATHS.collectionDetail('men'), label: "Men" },
  { href: COLLECTION_PATHS.collectionDetail('kids'), label: "Kids" },
  { href: COLLECTION_PATHS.collectionDetail('beauty'), label: "Beauty" },
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

export const SUBS_CATEGORY =  [
					
      { href: "/new-in", label: "New in " },
      { href: "/nova-deals", label: "Nova Deals" },
	{ href: COLLECTION_PATHS.collectionDetail('halloween'), label: "Halloween" },
	{ href: COLLECTION_PATHS.collectionDetail('formal-shop'), label: "Formal Shop" },
	{ href: COLLECTION_PATHS.collectionDetail('dresses'), label: "Dresses" },
	{ href: COLLECTION_PATHS.collectionDetail('matching-sets'), label: "Matching Sets" },
	{ href: COLLECTION_PATHS.collectionDetail('tops'), label: "Tops" },
	{ href: COLLECTION_PATHS.collectionDetail('jeans'), label: "Jeans" },
					{ href: COLLECTION_PATHS.collectionDetail('jackets'), label: "Jackets" },
					{ href: COLLECTION_PATHS.collectionDetail('sweaters'), label: "Sweaters" },
					{ href: COLLECTION_PATHS.collectionDetail('shoes'), label: "Shoes" },
					{ href: COLLECTION_PATHS.collectionDetail('bottoms'), label: "Bottoms" },
					{ href: COLLECTION_PATHS.collectionDetail('jumpsuits'), label: "Jumpsuits" },
					{ href: COLLECTION_PATHS.collectionDetail('lingerie-sleep'), label: "Lingerie & Sleep" },
					{ href: COLLECTION_PATHS.collectionDetail('accessories'), label: "Accessories" },
					{ href: COLLECTION_PATHS.collectionDetail('activewear'), label: "Activewear" },
					{ href: COLLECTION_PATHS.collectionDetail('nova-luxe'), label: "Nova Luxe" },
					{ href: COLLECTION_PATHS.collectionDetail('sale'), label: "Sale" },
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