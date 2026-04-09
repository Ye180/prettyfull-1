"use client";

import { LoginForm } from "@/features/auth/components";
import { Logo } from "@prettyfull/ui";

import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

export default function LoginPage() {
	return (
		<Flex className="h-full w-full *:w-full ">
			<Container
				maxWidth="70rem"
				className="flex flex-col justify-center space-y-28"
			>
				<Logo className="mt-10" />
				<LoginForm />
			</Container>
		</Flex>
	);
}
