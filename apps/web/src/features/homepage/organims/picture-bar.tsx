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
	const className = "h-[60vh] px-4 lg:h-[80vh] lg:px-40";
	if (isLoading || !imageMobile || !imageDesktop) {
		return (
			<Container maxWidth="100vw" className={className}>
				<LoadingPrettyfull />
			</Container>
		);
	}

	return (
		<Container maxWidth="100vw" className={cn(className)}>
			<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover max-lg:hidden lg:flex">
				<Image
					src={imageDesktop}
					alt="desktop image"
					fill
					objectFit="cover"
					className="overflow-hidden h-full bg-center bg-no-repeat bg-cover max-lg:hidden lg:flex bg-black/60"
				/>
			</div>
			<div className="overflow-hidden relative h-full bg-center bg-no-repeat bg-cover max-lg:flex lg:hidden">
				<Image
					src={imageMobile}
					alt="phone image"
					fill
					objectFit="cover"
					className="overflow-hidden h-full bg-center bg-no-repeat bg-cover max-lg:flex lg:hidden bg-black/60"
				/>
			</div>
		</Container>
	);
};

export default PictureBar;
