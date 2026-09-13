import Image from "next/image";
import Link from "next/link";

export interface PhotoOverlayBannerProps {
	image: string;
	imageAlt?: string;
	height?: "sm" | "md" | "lg";
	topLabels?: string[];
	bottomLabels?: string[];
	title?: string;
	subtitle?: string;
	titleAlign?: "center" | "bottom-left";
	cta?: { label: string; href: string };
	className?: string;
	contained?: boolean;
}

export const PhotoOverlayBanner = ({
	image,
	imageAlt = "Banner",
	height = "lg",
	topLabels,
	bottomLabels,
	title,
	subtitle,
	titleAlign = "center",
	cta,
	className = "",
	contained = true,
}: PhotoOverlayBannerProps) => {
	const heightClasses = {
		sm: "h-[26rem]",
		md: "h-[36rem]",
		lg: "min-h-[46rem] h-[55vh]",
	}[height];

	const content = (
		<div
			className={`relative w-full overflow-hidden ${heightClasses} ${
				contained ? "rounded-[2.4rem]" : ""
			} ${className}`}
		>
			<Image
				src={image}
				alt={imageAlt}
				fill
				sizes="(max-width: 1400px) 100vw, 1400px"
				className="object-cover"
				priority={height === "lg"}
			/>
			<div className="absolute inset-0 bg-black/40" aria-hidden="true" />

			{topLabels && topLabels.length > 0 && (
				<div className="flex absolute inset-x-0 top-8 justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
					{topLabels.map((label) => (
						<span key={label}>{label}</span>
					))}
				</div>
			)}

			{title &&
				(titleAlign === "center" ? (
					<div className="flex absolute inset-0 flex-col gap-6 justify-center items-center px-6 text-center text-white z-10 max-w-4xl mx-auto">
						<h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
							{title}
						</h2>
						{subtitle && (
							<p className="max-w-2xl text-[1.5rem] sm:text-[1.6rem] text-white/85 leading-relaxed">
								{subtitle}
							</p>
						)}
						{cta && (
							<Link
								href={cta.href}
								className="inline-flex items-center gap-3 px-8 py-3.5 mt-2 text-[1.4rem] font-medium text-black bg-white rounded-full transition-all hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg"
							>
								<span>{cta.label}</span>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</Link>
						)}
					</div>
				) : (
					<div className="flex absolute inset-x-0 bottom-10 flex-col gap-4 px-8 text-white sm:px-12 z-10 max-w-2xl">
						<h2 className="text-white text-3xl sm:text-4xl font-bold">{title}</h2>
						{subtitle && (
							<p className="text-[1.5rem] text-white/85 leading-relaxed">{subtitle}</p>
						)}
					</div>
				))}

			{bottomLabels && bottomLabels.length > 0 && (
				<div className="flex absolute inset-x-0 bottom-6 justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
					{bottomLabels.map((label) => (
						<span key={label}>{label}</span>
					))}
				</div>
			)}
		</div>
	);

	if (contained) {
		return (
			<div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 my-16">
				{content}
			</div>
		);
	}

	return content;
};

export default PhotoOverlayBanner;
