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

	console.log("imageDesktop", imageDesktop);
	console.log("imageMobile", imageMobile);

	return (
		<>
			{imageDesktop || imageMobile ? (
				<Container maxWidth="100vw" className={cn(className)}>
					<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover hidden! sm:flex! ">
						<Image
							src={imageDesktop + "?view=1" || ""}
							alt="phone image"
							fill
							objectFit="cover"
							className="flex overflow-hidden h-full bg-center bg-no-repeat bg-cover bg-black/60"
						/>
					</div>
					<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover flex! sm:hidden!">
						<Image
							src={imageMobile + "?view=1" || ""}
							alt="phone image"
							fill
							objectFit="cover"
							className="flex overflow-hidden h-full bg-center bg-no-repeat bg-cover bg-black/60"
						/>
					</div>
				</Container>
			) : null}
		</>
	);
};

export default PictureBar;
