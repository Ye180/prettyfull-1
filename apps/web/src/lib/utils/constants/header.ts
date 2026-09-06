// import { Cart } from "@/components/icons/cart.icon";
import { paths } from "@/lib/routes/paths-en";
import { Heart, } from "../../../../../../packages/ui/src/icons/heart.icon";
import { UserIcon } from "../../../../../../packages/ui/src/icons/user.icon";

export const NAV_USER_LINKS = [
      { icon: Heart, href: paths.wishlist, infos: { count:  2} },                                        
      { icon: UserIcon, href: paths.account,  },
      // { icon: Cart , href: paths.cart, infos: { count: 5 }, visible: true },
]
/**
 * Pages d'information du menu principal.
 *
 * Distinctes des rayons : le menu du haut est piloté par les catégories du
 * catalogue, qui ne connaissent ni « À propos » ni « Contact ». Les déclarer
 * ici les rend disponibles au menu desktop comme au menu mobile, à partir
 * d'une source unique.
 */
export const NAV_INFO_LINKS = [
      { label: "À propos", href: paths.about },
      { label: "Contact", href: paths.contact },
      { label: "FAQ", href: paths.faq },
];
