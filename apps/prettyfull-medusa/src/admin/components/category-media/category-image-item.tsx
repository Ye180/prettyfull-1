import { ThumbnailBadge } from "@medusajs/icons";
import { Checkbox, clx } from "@medusajs/ui";

import { withGarageViewParam } from "../../lib/garage-url";

type CategoryImageItemProps = {
	id: string;
	url: string;
	alt: string;
	isThumbnail: boolean;
	isSelected: boolean;
	onToggleSelect: () => void;
};

export const CategoryImageItem = ({
	id,
	url,
	alt,
	isThumbnail,
	isSelected,
	onToggleSelect,
}: CategoryImageItemProps) => {
	return (
		<div
			key={id}
			className="overflow-hidden relative max-w-full h-auto rounded-lg outline-none shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group aspect-square"
		>
			{isThumbnail && (
				<div className="absolute top-2 left-2">
					<ThumbnailBadge />
				</div>
			)}
			<div
				className={clx(
					"transition-fg absolute right-2 top-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
					isSelected && "opacity-100",
				)}
			>
				<Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
			</div>
			<img
				src={withGarageViewParam(url)}
				alt={alt}
				className="object-cover object-center size-full"
			/>
		</div>
	);
};
