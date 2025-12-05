import {
	CustomModal,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@prettyfull/ui";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Currency() {
	const router = useRouter();
	const pathname = usePathname();

	const [open, setOpen] = useState(false);
	const onClose = () => setOpen(false);

	const changeLanguage = (locale: string) => {
		// Redirect to the new locale while preserving the current path
		router.push(`/${locale}${pathname.replace(/^\/(en|fr|es)/, "")}`);
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="outline-none outline-black/20 flex items-end justify-between! px-2 py-2 w-fit rounded-md  h-fit hover:bg-black hover:text-white cursor-pointer">
					<p
						className="text-[1.3rem] lg:text-[1.5rem] tracking-normal"
						onClick={() => setOpen(true)}
					>
						<span>FR</span>
						<span className="mx-1">/</span>
						<span>XOF</span>
					</p>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="px-6 py-8 mr-4 space-y-4 bg-gray-100 rounded-lg border-none shadow-2xl outline-none w-132 h-fit top-15">
					<div className="pb-4 space-y-3">
						<h4 className="text-[2.2rem]! ">Currency</h4>
						<div className="flex flex-wrap gap-4 mt-0">
							{[
								{ label: "Euro (€)", symbol: "€" },
								{ label: "Dollar ($)", symbol: "$" },
								{ label: "Franc CFA (XOF)", symbol: "FCFA" },
							].map((items, index) => (
								<div
									key={index}
									className="flex gap-3 justify-between items-center px-4 py-3 rounded-xl border border-gray-300 transition-all duration-300 cursor-pointer py w-fit hover:bg-black hover:text-white hover:border-black"
								>
									<p className="text-[1.2rem] font-semibold">{items.label}</p>
								</div>
							))}
						</div>
					</div>

					<DropdownMenuSeparator />

					<div className="mt-6 space-y-3">
						<h4 className="text-[2.2rem]!">Langue</h4>
						<div className="flex flex-wrap gap-4 mt-0">
							{[
								{ label: "Anglais", symbol: "en" },
								{ label: "Français", symbol: "fr" },
							].map((items, index) => (
								<button
									key={index}
									className="flex gap-3 justify-between items-center px-6 py-3 rounded-xl border border-gray-300 transition-all duration-300 cursor-pointer py w-fit hover:bg-black hover:text-white hover:border-black"
									onClick={() => changeLanguage(items.symbol)}
								>
									<p className="text-[1.2rem] font-semibold">
										{items.label} ({items.symbol})
									</p>
								</button>
							))}
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
