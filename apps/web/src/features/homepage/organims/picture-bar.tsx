import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const PictureBar = ({
	imageDesktop,
	imageMobile,
}: {
	imageDesktop: string | StaticImport;
	imageMobile: string | StaticImport;
}) => {
	return (
		<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
			<div className="relative h-full overflow-hidden bg-center bg-no-repeat bg-cover max-lg:hidden lg:flex ">
				<Image
					src={imageDesktop}
					alt="desktop image"
					fill
					objectFit="cover"
					className="h-full overflow-hidden bg-center bg-no-repeat bg-cover max-lg:hidden lg:flex bg-black/60"
				/>
			</div>
			<div className="relative h-full overflow-hidden bg-center bg-no-repeat bg-cover max-lg:flex lg:hidden ">
				<Image
					src={imageMobile}
					alt="phone image"
					fill
					objectFit="cover"
					className="h-full overflow-hidden bg-center bg-no-repeat bg-cover max-lg:flex lg:hidden bg-black/60"
				/>
			</div>
		</Container>
	);
};

export default PictureBar;
