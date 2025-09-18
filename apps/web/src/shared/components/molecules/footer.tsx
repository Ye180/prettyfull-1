"use client";

import { FOOTER_DATA, SOCIALS_DATA_FOOTER } from "@/lib/utils/constants";
import Link from "next/link";
import { type FC } from "react";
import ArrowRightIcon from "../../../../../../packages/ui/src/icons/arrow-right.icon";

const Footer: FC = () => {
	return (
		<footer className="py-16 text-white bg-black">
			<div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between max-lg:flex-col max-lg:space-y-20">
					{/* LEFT SECTION */}
					<div className="flex flex-col space-y-10 text-md max-lg:w-full lg:w-2/6 md:items-start ">
						<h3 className="!text-[3.5rem] font-semibold tracking-wider">
							PRETTYFULL
						</h3>
						<p className="w-full font-light leading-relaxed text-white/80">
							Prettyfull is a sustainable fashion brand that creates stylish,
							igh-quality clothing for confident self-expression. Join us or
							modern fashion with a classic twist.
						</p>

						{/* Newsletter */}
						<div className="w-full max-w-sm">
							<label htmlFor="email" className="font-semibold tracking-wider ">
								EMAIL
							</label>
							<div className="relative mt-2">
								<input
									type="email"
									id="email"
									className="w-full py-2 pr-10 bg-transparent border-b border-gray-600 outline-none focus:border-white focus:ring-0"
									placeholder="Your email address"
								/>
								<button className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
									<ArrowRightIcon className="text-gray-400 transition-colors hover:text-white" />
								</button>
							</div>
						</div>

						{/* Socials */}
						<div className="flex space-x-6 md:justify-start">
							{SOCIALS_DATA_FOOTER.map((items, index) => (
								<Link
									key={index}
									href={items.href}
									aria-label={items.label}
									className="text-gray-400 transition-colors !text-md hover:text-white"
								>
									{<items.icon />}
								</Link>
							))}
						</div>
					</div>

					{/* RIGHT SECTION */}
					<div className="flex max-lg:justify-between lg:justify-start lg:w-3/6 max-lg:w-full">
						{/* SHOP */}

						{FOOTER_DATA.map((items, index) => (
							<div key={index} className="text-left lg:w-auto lg:flex-1">
								<h5 className="mb-3 !text-[2.5rem] font-semibold tracking-wider">
									{items.title}
								</h5>
								<ul className="space-y-3 text-gray-400 text-md">
									{items.links.map((link) => (
										<li key={link.label}>
											<Link
												href="/"
												className="transition-colors hover:text-white"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
