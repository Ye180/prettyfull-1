"use client";

import { Check, CustomModal } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
	const t = useTranslations("Auth.modal");
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

	const benefits = [t("benefit1"), t("benefit2"), t("benefit3")];

	return (
		<CustomModal
			open={open}
			onClose={onClose}
			hideTitle
			title={mode === "login" ? t("loginTitle") : t("registerTitle")}
			className="w-[95vw] sm:w-[92vw] sm:max-w-none lg:w-[90rem] xl:w-[104rem] max-h-[92vh] p-0 gap-0 rounded-[2.4rem] border-none overflow-hidden"
		>
			<div className="grid lg:grid-cols-[1fr_1.15fr]">
				{/* Panneau éditorial - identité de marque, caché sur mobile pour
				 * garder le formulaire au centre de l'attention. */}
				<div className="hidden relative min-h-[58rem] lg:block">
					<Image
						src="/products/shop/hero-shopping-alt.jpg"
						alt=""
						fill
						sizes="40vw"
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

					<div className="flex relative z-10 flex-col justify-between p-10 h-full text-white xl:p-12">
						<span className="text-[1.6rem] tracking-[0.2em] uppercase [font-family:var(--font-display)]">
							Prettyfull
						</span>

						<div className="space-y-6">
							<h3 className="text-[3rem]! font-medium! text-white! leading-[1.1] xl:text-[3.4rem]! [font-family:var(--font-display)]!">
								{t("panelHeadline")}
							</h3>
							<ul className="space-y-3">
								{benefits.map((benefit) => (
									<li
										key={benefit}
										className="flex gap-3 items-center text-[1.5rem] text-white/90"
									>
										<span className="flex justify-center items-center w-6 h-6 rounded-full shrink-0 bg-stone-900">
											<Check className="w-4 h-4 text-white" strokeWidth={3} />
										</span>
										{benefit}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Panneau formulaire */}
				<div className="overflow-y-auto p-6 max-h-[92vh] sm:p-10 lg:p-12">
					<div className="inline-flex gap-1 p-1 mb-10 bg-[#F5F5F5] rounded-xl">
						<button
							type="button"
							onClick={() => setMode("login")}
							className={cn(
								"px-6 py-2.5 rounded-lg text-[1.4rem] font-semibold transition-colors cursor-pointer",
								mode === "login"
									? "bg-white text-[#080808] shadow-sm"
									: "text-[#777777] hover:text-[#080808]",
							)}
						>
							{t("tabLogin")}
						</button>
						<button
							type="button"
							onClick={() => setMode("register")}
							className={cn(
								"px-6 py-2.5 rounded-lg text-[1.4rem] font-semibold transition-colors cursor-pointer",
								mode === "register"
									? "bg-white text-[#080808] shadow-sm"
									: "text-[#777777] hover:text-[#080808]",
							)}
						>
							{t("tabRegister")}
						</button>
					</div>

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
				</div>
			</div>
		</CustomModal>
	);
}
