import { Checkbox } from "@prettyfull/ui";

const Size = () => {
	return (
		<>
			{Array.from({ length: 9 }).map((_, i) => (
				<div
					className="flex items-center justify-center gap-4 uppercase border rounded-lg border-black/10 size-15"
					key={i}
				>
					{" "}
					<Checkbox className="flex items-center justify-center gap-4 border rounded-lg border-black/10 size-15">
						M
					</Checkbox>
				</div>
			))}
		</>
	);
};

export default Size;
