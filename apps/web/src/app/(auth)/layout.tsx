import Image from "next/image";
import AuthLayout from "../../../../../packages/ui/src/layouts/auth-layout";

const AuthRootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthLayout
			children={children}
			settings={{
				leftClassname: "sm:basis-[25%]  md:basis-0",
				rightClassname: "hidden sm:flex",
			}}
			rightChildren={
				<div>
					<Image
						className="object-cover"
						src="/assets/auth-bg.png"
						fill
						priority
						alt="Auth Right Background"
					/>
				</div>
			}
		/>
	);
};

export default AuthRootLayout;
