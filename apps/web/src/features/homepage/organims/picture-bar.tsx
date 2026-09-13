import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import { ImageOff } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const PictureBar = ({
	imageDesktop,
	isLoading,
	imageMobile,
}: {
	imageDesktop: string | StaticImport;
	isLoading?: boolean;
	imageMobile: string | StaticImport;
}) => {
	const className = "h-[75vh] px-4 lg:h-[80vh] lg:px-40";
	if (isLoading) {
		return (
			<Container maxWidth="100vw" className={className}>
				<LoadingPrettyfull />
			</Container>
		);
	}

	// La bannière reste affichée même sans visuel : seul son contenu retombe
	// sur un repli neutre, pour ne pas casser le rythme de la page d'accueil.
	if (!imageDesktop && !imageMobile) {
		return (
			<Container maxWidth="100vw" className={cn(className)}>
				<div className="flex overflow-hidden relative justify-center items-center h-full bg-gray-100">
					<ImageOff className="w-12 h-12 text-gray-300" strokeWidth={1.25} />
				</div>
			</Container>
		);
	}

	return (
		<Container maxWidth="100vw" className={cn(className)}>
			{/*
			 * Chaque variante retombe sur l'autre plutôt que sur une chaîne
			 * vide : `<Image src="">` fait retélécharger la page entière au
			 * navigateur, et Next le signale comme une erreur.
			 */}
			<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover hidden! sm:flex! ">
				<Image
					src={imageDesktop || imageMobile}
					alt=""
					fill
					sizes="(min-width: 640px) 100vw, 1px"
					className="flex object-cover overflow-hidden h-full bg-center bg-no-repeat bg-cover bg-black/60"
					unoptimized
				/>
			</div>
			<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover flex! sm:hidden!">
				<Image
					src={imageMobile || imageDesktop}
					alt=""
					fill
					sizes="(max-width: 639px) 100vw, 1px"
					className="flex object-cover overflow-hidden h-full bg-center bg-no-repeat bg-cover bg-black/60"
					unoptimized
				/>
			</div>
		</Container>
	);
};

export default PictureBar;
