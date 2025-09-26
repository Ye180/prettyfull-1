import { Input } from "@prettyfull/ui";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import Container from "../../../../../../../packages/ui/src/layouts/helpers/container";

const SearchBar = () => {
	return (
		<Container maxWidth="100vw" className="px-4 ">
			<div className="items-center justify-between w-full h-fit sm:hidden max-sm:flex max-sm:gap-x-2 ">
				<div className="items-center justify-start w-[100%] gap-2 py-1 text-gray-500 border-b border-gray-300 sm:hidden outline-gray-700 max-sm:flex ">
					<Search className="" />
					<Input
						placeholder="Rechercher..."
						className="h-4 border-none outline-1 text-black font-light  py-4  border-gray-300 focus:ring-0 focus:border-none  text-[1.8rem] max-md:flex  placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem]"
					/>
				</div>
			</div>
		</Container>
	);
};

export default SearchBar;
