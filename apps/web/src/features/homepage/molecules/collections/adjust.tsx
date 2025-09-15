import { Checkbox } from "@prettyfull/ui";

const Adjust = () => {
	return (
		<>
			{Array.from({ length: 4 }).map((_, i) => (
				<div className="flex items-start gap-4 text-balance" key={i}>
					{" "}
					<Checkbox className="" />
					<span className="text-[1.6rem]">Oversized</span>
				</div>
			))}
		</>
	);
};

export default Adjust;
