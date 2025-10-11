import { Label } from "./components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./components/ui/select";

const InputSelect = ({
	label,
	classNameSelect,
	items,
	placeholder,
}: {
	label: string;
	placeholder: string;
	classNameSelect: string;
	items: string[];
}) => {
	return (
		<Select>
			<div className="space-y-5">
				<Label className=" block text-[2.4rem] font-medium font-family-heading">
					{label}
				</Label>
				<SelectTrigger className="w-full text-[1.6rem]  ">
					<SelectValue
						className="block mb-2 font-medium font-family-heading placeholder:text-gray-100"
						placeholder={placeholder}
					/>
				</SelectTrigger>
				<SelectContent className="py-2">
					<SelectGroup className="px-2">
						<SelectLabel className="text-sm text-gray-600">
							Moyen de livraison
						</SelectLabel>
						{items.map((means, _) => {
							return (
								<SelectItem value={means} className={classNameSelect}>
									{means}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</div>
		</Select>
	);
};

export default InputSelect;
