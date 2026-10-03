import PageTransition from "@/shared/components/molecules/core/page-transition";

export default function HomeTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PageTransition>{children}</PageTransition>;
}
