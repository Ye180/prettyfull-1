import FacebookIcon from "@/components/icons/facebook.icon";
import InstagramIcon from "@/components/icons/instagram.icon";
import LinkedinIcon from "@/components/icons/linkedin.icon";
import TwitterIcon from "@/components/icons/twitter.icon";
import { BoxTypes } from "@/types/constants-type";
import { FC } from "react";

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
            label: "ÉTÉ",
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
                  { "label": "Contact", "url": "/help/contact" },
                  { "label": "FAQ", "url": "/help/faq" },
                  { "label": "Shipping & Return", "url": "/help/shipping-return" },
                  { "label": "Privacy Policy", "url": "/help/privacy-policy" },
                  { "label": "About Snaely", "url": "/help/about-snaely" }
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
      { href: "/special-offer", label: "Special Offer" },
      { href: "/collection", label: "Collection" },
	{ href: "/store", label: "Store" },
      ]


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

