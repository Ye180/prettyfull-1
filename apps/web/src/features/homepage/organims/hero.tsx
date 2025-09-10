import { Button } from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Hero = () => {
	return (
		<div className=" relative h-[90vh] w-full overflow-hidden bg-amber-500">
			<Container
				maxWidth="100vw"
				className="space-y-12 flex flex-col items-center lg:px-40 h-full justify-center bg-[url(/home/cover-phone.jpg)] md:bg-[url(/home/cover-desktop-1.jpg)] bg-center bg-cover"
			>
				<div className=" lg:p-8 rounded-xl w-full h-full flex justify-center md:justify-start items-end text-white">
					<div className="md:w-1/2  space-y-8  max-md:w-full max-lg:pb-20 lg: pb-40 max-md:text-center">
						<h1 className="!text-[3rem]  md:!text-[4.5rem] lg:!text-[5.5rem] leading-[6.5rem] tracking-tight font-normal text-center md:text-start   ">
							Des{" "}
							<span className="   rounded-2xl mr-2 lg:!text-[5rem] ">
								{" "}
								vêtements{" "}
							</span>{" "}
							pensés pour
							<span className="rounded-2xl mx-2  lg:!text-[5rem]">
								sublimer{" "}
							</span>{" "}
							chaque instant.
						</h1>
						<p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-[1.5] text-pretty lg:text-justify">
							Découvrez l’élégance de vêtements intemporels, pensés pour
							sublimer votre style, renforcer votre confiance et révéler votre
							singularité. Confortables, polyvalents et conçus pour rendre
							chaque instant inoubliable.
						</p>
						<Button
							variant="secondary"
							className="size-fit bg-none backdrop-blur-3xl"
						>
							Achetez maintenant
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Hero;
