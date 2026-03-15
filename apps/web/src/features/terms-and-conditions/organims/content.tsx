import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { DataRule } from "../data";

const Content = () => {
	return (
		<Container
			maxWidth="100vw"
			className="px-4 py-2 mx-auto space-y-10 sm:py-12 lg:px-80"
		>
			{DataRule.map((item, index) => (
				<div key={index} className="space-y-2">
					<h4 className="text-xl! font-medium font-manrope">{item.title}</h4>
					<p className="text-[1.8rem] md:text-[1.9rem] font-medium leading-12 font-manrope">
						{item.description}
					</p>
				</div>
			))}
		</Container>
	);
};

export default Content;
