"use client";

import { Button } from "@prettyfull/ui";
import { useRouter } from "next/navigation";
import { authClient } from "../../../shared/lib/auth.client";

export function LogoutButton() {
	const router = useRouter();
	const { signOut } = authClient;

	const handleLogout = async () => {
		await signOut();
		router.push("/login");
	};

	return (
		<Button onClick={handleLogout} variant="outline">
			Logout
		</Button>
	);
}
