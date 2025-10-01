import { useTranslations } from "next-intl";

const HeaderWishlist = () => {
	const t = useTranslations("Wishlist");
	return (
		<h1 className="!text-[2.8rem] md:!text-[3.5rem] font-semibold flex tracking-wide">
			{t("title")}
		</h1>
	);
};

export default HeaderWishlist;
