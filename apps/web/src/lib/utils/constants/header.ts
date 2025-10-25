import { Cart } from "@/components/icons/cart.icon";
import { paths } from "@/lib/routes/paths-en";
import { Heart, } from "../../../../../../packages/ui/src/icons/heart.icon";
import { UserIcon } from "../../../../../../packages/ui/src/icons/user.icon";

export const NAV_USER_LINKS = [
      { icon: Heart, href: paths.wishlist, infos: { count:  2} },                                        
      { icon: UserIcon, href: paths.account,  },
      { icon: Cart , href: paths.cart, infos: { count: 5 }, visible: true },
]