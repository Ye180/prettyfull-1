"use client";

import { CustomModal } from "@prettyfull/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "./forms/login-form";
import { RegisterForm } from "./forms/register-form";

export type AuthMode = "login" | "register";

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
	defaultMode?: AuthMode;
}

// ponytail: quick-auth modal so shoppers don't get bounced off the page to
// log in/sign up mid-cart - reuses the existing forms + CustomModal as-is,
// just toggles which one renders.
export function AuthModal({
	open,
	onClose,
	defaultMode = "login",
}: AuthModalProps) {
	const [mode, setMode] = useState<AuthMode>(defaultMode);
	const router = useRouter();

	// Reset to whichever entry point (Login vs Sign Up) was clicked each time
	// the modal opens, since it stays mounted between opens.
	useEffect(() => {
		if (open) setMode(defaultMode);
	}, [open, defaultMode]);

	const handleSuccess = () => {
		onClose();
		router.refresh();
	};

	return (
		<CustomModal
			open={open}
			onClose={onClose}
			hideTitle
			title={mode === "login" ? "Connexion" : "Créer un compte"}
			className="w-[95vw] lg:w-[35vw] p-6"
		>
			{mode === "login" ? (
				<LoginForm
					onSuccess={handleSuccess}
					onSwitchMode={() => setMode("register")}
				/>
			) : (
				<RegisterForm
					onSuccess={handleSuccess}
					onSwitchMode={() => setMode("login")}
				/>
			)}
		</CustomModal>
	);
}
