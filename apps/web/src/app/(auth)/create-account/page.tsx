"use client";

import { RegisterForm } from "@/features/auth/components";
import { Logo } from "@prettyfull/ui";

import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

export default function RegisterPage() {
	return (
		<Flex className="h-full w-full [&>*]:w-full ">
			<Container maxWidth="70rem" className="space-y-28">
				<Logo className="mt-20 " />
				<RegisterForm />
			</Container>
		</Flex>
	);
}
