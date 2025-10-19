import { Input } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import Container from "../../../../../../../packages/ui/src/layouts/helpers/container";

const SearchBar = () => {
	const t = useTranslations("HomePage.header");
	return (
		<Container maxWidth="100vw" className="px-4 ">
			{/* <div className="items-center justify-between w-full h-fit sm:hidden max-sm:flex max-sm:gap-x-2 "> */}
			{/* <div className="items-center  w-[100%] gap-2 py-1 text-gray-500 border-b border-gray-300 sm:hidden outline-gray-700 max-sm:flex bg-amber-100  flex justify-between"> */}
			{/* <Search className="" /> */}
			<div className="flex items-center justify-center w-full gap-2 pb-2 border-b border-gray-300 ">
				<Search className="opacity-50" />
				<div className="w-full ">
					<Input
						placeholder={t("placeholder")}
						className="h-4 flex-1  border-none outline-1  px-0 text-black font-light  py-4  border-gray-300 focus:ring-0 focus:border-none  text-[1.8rem] max-md:flex  placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
					/>
				</div>
				{/* <Input
					placeholder={t("placeholder")}
					className="h-4 flex-1  border-none outline-1  px-0 text-black font-light  py-4  border-gray-300 focus:ring-0 focus:border-none  text-[1.8rem] max-md:flex  placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
				/> */}
			</div>

			{/* </div> */}
			{/* </div> */}
		</Container>
	);
};

export default SearchBar;
