import React from "react";

export interface PrettyfullLogoProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
}

export const PrettyfullLogo: React.FC<PrettyfullLogoProps> = ({
	size = 32,
	className,
	...props
}) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			{...props}
		>
			{/* Top vertical arrow into center */}
			<line
				x1="18"
				y1="3"
				x2="18"
				y2="14"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<path
				d="M11 9L18 16L25 9"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Bottom vertical arrow into center */}
			<line
				x1="18"
				y1="33"
				x2="18"
				y2="22"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<path
				d="M11 27L18 20L25 27"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Left & right horizontal stems */}
			<line
				x1="3"
				y1="18"
				x2="13"
				y2="18"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<line
				x1="33"
				y1="18"
				x2="23"
				y2="18"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>

			{/* Diagonals */}
			<line
				x1="8"
				y1="18"
				x2="14"
				y2="18"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<line
				x1="28"
				y1="18"
				x2="22"
				y2="18"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default PrettyfullLogo;
