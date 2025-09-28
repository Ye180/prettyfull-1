import { Button } from "@prettyfull/ui";

const DropdownContentCart = () => {
	return (
		<span className="absolute z-50 h-fit p-4 py-6 mt-2 text-sm text-black bg-white rounded-md shadow-2xl w-[40rem] -left-[36rem] top-20  flex flex-col justify-center items-center border border-gray-100 max-sm:hidden">
			<div className="py-8">
				<h4 className="mb-4 !text-[1.8rem] font-semibold font-manrope">
					Your bag is empty.
				</h4>
			</div>

			<div className="flex justify-between w-full gap-4">
				<Button variant="default" className="py-4 font-semibold">
					Go to Cart
				</Button>
				<Button variant="outline" className="py-4 font-semibold">
					Fermer
				</Button>
			</div>
		</span>
	);
};

export default DropdownContentCart;
