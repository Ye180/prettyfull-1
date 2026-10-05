import type { Review } from "@prettyfull/contracts";
import { StarIcon } from "@prettyfull/ui";
import { useLocale, useTranslations } from "next-intl";

const formatDate = (iso: string, locale: string) =>
	new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

const Stars = ({ rating }: { rating: number }) => (
	<div className="flex items-center gap-1">
		{Array.from({ length: 5 }).map((_, index) => (
			<span
				key={index}
				className={index < rating ? "text-[#ffce31]" : "text-gray-200"}
			>
				<StarIcon />
			</span>
		))}
	</div>
);

const Photos = ({ photoUrls }: { photoUrls: string[] }) => {
	const t = useTranslations("ProductPage.reviews");
	if (photoUrls.length === 0) return null;
	return (
		<div className="flex gap-2 pl-2">
			{photoUrls.map((url) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					key={url}
					src={url}
					alt={t("photoAlt")}
					className="w-16 h-16 rounded-xl object-cover border border-gray-200"
				/>
			))}
		</div>
	);
};

export const ReviewsOneItems = ({ review }: { review: Review }) => {
	const locale = useLocale();
	return (
		<div className="p-6 space-y-4 rounded-2xl border border-gray-200">
			<div className="flex justify-between items-start">
				<div className="flex gap-4 items-center text-sm font-light">
					<div className="w-14 h-14 bg-black rounded-full" />
					<div>
						<h5 className="tracking-wide">{review.authorName}</h5>
						<Stars rating={review.rating} />
					</div>
				</div>
				<p className="text-sm font-light tracking-wide text-gray-500">
					{formatDate(review.createdAt, locale)}
				</p>
			</div>
			<p className="text-base font-normal tracking-wide text-black">{review.body}</p>
			<Photos photoUrls={review.photoUrls} />
		</div>
	);
};
