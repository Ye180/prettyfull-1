import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Content = () => {
	return (
		<Container
			maxWidth="100vw"
			className="px-4 py-2 mx-auto space-y-10 sm:py-12 lg:px-80 "
		>
			<h4 className="!font-light font-manrope !text-[3.5rem] w-full">
				Frequently Asked Questions
			</h4>
			<p className="text-[1.7rem] md:text-[1.9rem] !font-light leading-12 font-manrope">
				We’re moving warehouse so it may take us a little longer than usual to
				process orders & refunds. Please allow up to 7-8 working days for your
				order to arrive, and 10 working days from dropping off your returns
				parcel for it to be processed.
			</p>
		</Container>
	);
};

export default Content;
