'use client";';
import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { Button } from "@prettyfull/ui";
import { useRouter } from "next/navigation";

const ViewAll = ({
	children,
	href,
}: {
	children: React.ReactNode;
	href?: string;
}) => {
	const router = useRouter();

	return (
		<Button
			variant="outline"
			size="lg"
			className="w-fit max-sm:py-2 max-sm:px-4 py-4 px-8 h-fit flex justify-center items-center max-md:text-[1.4rem] hover:bg-black/90 hover:border-black/90 hover:text-white transition-colors duration-300 ease-in-out "
			onClick={() => {
				if (href) {
					router.push(href);
				}
			}}
		>
			<span className="max-md:pt-1 ">{children}</span>

			<ArrowRightIcon
				className="text-[1rem] h-full max-md:pt-0.5 "
				width={10}
				height={20}
			/>
		</Button>
	);
};

export default ViewAll;
