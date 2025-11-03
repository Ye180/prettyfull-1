import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SelectScrollable({
	control,
	nameId,
	label,
	placeholder,
	data,
}) {
	return (
		<FormField
			control={control}
			name={nameId} // Le nom du champ dans le formulaire
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<SelectTrigger className="w-full rounded-md! py-4">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{data?.map((data) => (
										<SelectItem key={data.id} value={data.id}>
											{data.name}
										</SelectItem>
									))}
								</SelectGroup>
								{/* <SelectGroup>
									<SelectLabel>Accessoires</SelectLabel>
									<SelectItem value="sacs">Sacs</SelectItem>
									<SelectItem value="bijoux">Bijoux</SelectItem>
									<SelectItem value="chaussures">Chaussures</SelectItem>
								</SelectGroup> */}
							</SelectContent>
						</Select>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
