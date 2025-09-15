"use client";

import { type FC } from "react";
import Link from "next/link";
import ArrowRightIcon from "./icons/arrow-right.icon";
import TwitterIcon from "./icons/twitter";
import LinkedinIcon from "./icons/linkedin.icon";
import InstagramIcon from "./icons/instagram.icon";
import FacebookIcon from "./icons/facebook.icon";

const Footer: FC = () => {
	return (
		<footer className="bg-black text-white py-16">
			<div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex max-lg:flex-col flex-row md:justify-between max-lg:items-start space-y-10 md:space-y-5">
					{/* LEFT SECTION */}
					<div className="space-y-6 flex flex-col md:items-start">
						<h3 className="text-xl font-bold tracking-wider">PRETTYFULL</h3>
						<p className="text-gray-400 text-xs leading-relaxed max-w-sm">
							Prettyfull is a sustainable fashion brand that creates stylish,
							high-quality clothing for confident self-expression. Join us for
							modern fashion with a classic twist.
						</p>

						{/* Newsletter */}
						<div className="w-full max-w-sm">
							<label
								htmlFor="email"
								className="text-xs font-semibold tracking-wider"
							>
								EMAIL
							</label>
							<div className="relative mt-2">
								<input
									type="email"
									id="email"
									className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:ring-0 outline-none pr-10 py-2 text-xs"
									placeholder="Your email address"
								/>
								<button className="absolute inset-y-0 right-0 flex items-center pr-3">
									<ArrowRightIcon className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
								</button>
							</div>
						</div>

						{/* Socials */}
						<div className="flex space-x-4 md:justify-start">
							<Link
								href="#"
								aria-label="Facebook"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<FacebookIcon className="w-5 h-5" />
							</Link>
							<Link
								href="#"
								aria-label="Twitter"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<TwitterIcon className="w-5 h-5" />
							</Link>
							<Link
								href="#"
								aria-label="LinkedIn"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<LinkedinIcon className="w-5 h-5" />
							</Link>
							<Link
								href="#"
								aria-label="Instagram"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<InstagramIcon className="w-5 h-5" />
							</Link>
						</div>
					</div>

					{/* RIGHT SECTION */}
					<div className="flex flex-wrap lg:flex-nowrap gap-y-10 lg:gap-x-10 justify-between">
						{/* SHOP */}
						<div className="w-1/2 lg:w-auto lg:flex-1 text-left">
							<h5 className="font-semibold tracking-wider mb-3 text-sm">
								SHOP
							</h5>
							<ul className="space-y-3 text-gray-400 text-xs">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Woman
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Man
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Divided
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Baby
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Children
									</Link>
								</li>
							</ul>
						</div>

						{/* HELP */}
						<div className="w-1/2 lg:w-auto lg:flex-1 text-left">
							<h5 className="font-semibold tracking-wider mb-3 text-sm">
								HELP
							</h5>
							<ul className="space-y-3 text-gray-400 text-xs">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Contact
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										FAQ
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Shipping & Return
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										About Snaely
									</Link>
								</li>
							</ul>
						</div>

						{/* ABOUT */}
						<div className="w-full lg:flex-1 lg:w-auto text-left">
							<h5 className="font-semibold tracking-wider mb-3 text-sm">
								ABOUT
							</h5>
							<ul className="space-y-3 text-gray-400 text-xs">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Just Arrived
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Customization
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Shop by Look
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Wedding
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										About Snaely
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
