import { Input } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search } from "../../../../packages/ui/src/icons/search.icon";

export default function NotFound() {
	const t = useTranslations("HomePage.header");
	return (
		<div className="flex flex-col justify-center items-center px-4 min-h-screen from-gray-50 to-white bg-linear-to-b">
			{/* Decorative elements */}
			<div className="overflow-hidden absolute inset-0 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-50 rounded-full opacity-60 blur-3xl" />
				<div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-rose-50 rounded-full opacity-60 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto max-w-xl text-center">
				{/* 404 Number */}
				<div className="relative mb-8">
					<h1 className="text-[180px] md:text-[220px] font-bold text-gray-100 leading-none select-none">
						404
					</h1>
					<div className="flex absolute inset-0 justify-center items-center">
						<div className="flex justify-center items-center w-24 h-24 bg-white rounded-full shadow-xl md:w-32 md:h-32">
							<svg
								className="w-12 h-12 text-gray-300 md:w-16 md:h-16"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Message */}
				<h2 className="mb-4 text-2xl font-semibold text-gray-800 md:text-3xl">
					Oups ! Page introuvable
				</h2>
				<p className="mb-10 text-base leading-relaxed text-gray-500 md:text-lg">
					La page que vous recherchez semble avoir disparu.
					<br className="hidden md:block" />
					Peut-être a-t-elle été déplacée ou n&apos;existe plus.
				</p>

				{/* Actions */}
				<div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
					<Link
						href="/"
						className="inline-flex items-center justify-center  gap-6 px-8 py-5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5"
					>
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							/>
						</svg>
						<span> Retour à l&apos;accueil</span>
					</Link>
					<Link
						href="/collections/all"
						className="inline-flex items-center justify-center gap-6 px-8 py-5 bg-white text-gray-700 font-medium rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5"
					>
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
							/>
						</svg>
						<span>Voir la boutique</span>
					</Link>
				</div>

				{/* Search suggestion */}
				<div className="flex flex-col justify-center items-center pt-8 mt-12 space-y-12 border-t border-gray-100">
					<p className="mb-4 text-sm text-gray-400">
						Vous cherchez quelque chose en particulier ?
					</p>
					<div className="relative mx-auto max-w-md">
						<div className="flex gap-2 justify-start items-center px-6 py-3 w-full text-gray-500 rounded-2xl border border-gray-300 px- outline-gray-700 max-sm:hidden lg:w-140">
							<Search className="" />
							<Input
								placeholder={t("placeholder")}
								className="h-4  border-none outline-1 text-black font-light px-2 py-4 border-gray-300  text-[1.6rem] max-sm:hidden w-full sm:w-full placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
