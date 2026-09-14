"use client";

import Image from "next/image";
import Link from "next/link";
import HomeLayout from "@/components/layout/home-layout";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";

export default function NotFound() {
	return (
		<HomeLayout>
			<main className="flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
				<div className="relative w-full max-w-[1400px] h-[520px] sm:h-[620px] md:h-[680px] rounded-3xl overflow-hidden shadow-md flex items-center justify-center text-center">
					{/* Background Image */}
					<Image
						src="/home/cover-desktop-1.jpg"
						alt="Page introuvable"
						fill
						priority
						sizes="100vw"
						className="object-cover object-center brightness-75"
					/>
					<div className="absolute inset-0 bg-black/40" />

					{/* Center Overlay Content */}
					<div className="relative z-10 max-w-xl mx-auto px-6 text-white space-y-6">
						<span className="text-xs uppercase tracking-widest font-semibold text-gray-300">
							Erreur 404
						</span>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight">
							Page introuvable
						</h1>
						<p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed max-w-md mx-auto">
							La pièce que vous recherchez a peut-être changé de place ou n'est plus disponible dans cette collection.
						</p>

						<div className="pt-2">
							<Link
								href="/"
								className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-gray-950 font-semibold rounded-full hover:bg-gray-100 transition shadow-lg group text-sm sm:text-base cursor-pointer"
							>
								<span>Retour à l'accueil</span>
								<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 text-black" />
							</Link>
						</div>
					</div>
				</div>
			</main>
		</HomeLayout>
	);
}
