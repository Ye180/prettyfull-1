import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@prettyfull/ui";

export function Currency() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="outline-none outline-black/20 flex items-end !justify-between px-2 py-2 w-fit rounded-md  h-fit hover:bg-black hover:text-white cursor-pointer">
				<p className="text-[1.3rem] lg:text-[1.5rem] tracking-normal">
					<span>FR</span>
					<span className="mx-1">/</span>
					<span>XOF</span>
				</p>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=" px-6 py-8 mr-4 bg-gray-100 rounded-lg w-[33rem] h-fit space-y-4 top-15 shadow-2xl outline-none border-none">
				<div className="pb-4 space-y-3">
					<h4 className="!text-[2.2rem] ">Currency</h4>
					<div className="flex flex-wrap gap-4 mt-0">
						{[
							{ label: "Euro (€)", symbol: "€" },
							{ label: "Dollar ($)", symbol: "$" },
							{ label: "Franc CFA (XOF)", symbol: "FCFA" },
						].map((items, index) => (
							<div
								key={index}
								className="flex items-center justify-between gap-3 px-4 py-3 transition-all duration-300 border border-gray-300 cursor-pointer py rounded-xl w-fit hover:bg-black hover:text-white hover:border-black"
							>
								<p className="text-[1.2rem] font-semibold">{items.label}</p>
							</div>
						))}
					</div>
				</div>

				<DropdownMenuSeparator />

				<div className="mt-6 space-y-3">
					<h4 className="!text-[2.2rem]">Langue</h4>
					<div className="flex flex-wrap gap-4 mt-0">
						{[
							{ label: "Anglais", symbol: "AN" },
							{ label: "Français", symbol: "FR" },
						].map((items, index) => (
							<div
								key={index}
								className="flex items-center justify-between gap-3 px-6 py-3 transition-all duration-300 border border-gray-300 cursor-pointer py rounded-xl w-fit hover:bg-black hover:text-white hover:border-black"
							>
								<p className="text-[1.2rem] font-semibold">
									{items.label} ({items.symbol})
								</p>
							</div>
						))}
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
