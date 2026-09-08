import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
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

	return (
		<>
			{imageDesktop || imageMobile ? (
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
			) : null}
		</>
	);
};

export default PictureBar;
