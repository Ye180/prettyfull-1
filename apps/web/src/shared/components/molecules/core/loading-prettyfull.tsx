import Image from "next/image";

const FALLBACK_IMAGE = "/assets/logo.png";

export const LoadingPrettyfull = () => (
	<div className="flex justify-center items-center w-full h-full bg-gray-200">
		<Image
			src={FALLBACK_IMAGE}
			alt="Hero background image"
			width={900}
			height={300}
			// fill
			// sizes={"100%"}
			className="w-full h-fit"
			priority
		/>
	</div>
);
