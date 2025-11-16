export default function CustomerIcon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={28}
			height={28}
			viewBox="0 0 24 24"
			{...props}
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.2}
			>
				<circle cx={9} cy={9} r={4}></circle>
				<path d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"></path>
				<path d="M22 19c0-3.314-3.134-6-7-6c-.807 0-2.103-.293-3-1.235"></path>
			</g>
		</svg>
	);
}
