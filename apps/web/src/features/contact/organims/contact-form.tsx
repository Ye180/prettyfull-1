"use client";

import { StoreApiError, sendContactMessage } from "@/lib/store-api";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { getSubjects } from "../data";

/**
 * Formulaire de contact.
 *
 * Les messages sont enregistrés côté API et relevés depuis le back-office -
 * un formulaire qui perdrait les envois serait pire que pas de formulaire.
 *
 * Les erreurs de validation sont replacées sous leur champ : « Adresse e-mail
 * invalide » sous l'e-mail vaut mieux qu'un bandeau rouge en tête de page qui
 * oblige à chercher.
 */

interface FormState {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	/** Champ leurre : invisible pour un humain, rempli par les robots. */
	website: string;
}

const EMPTY: FormState = {
	name: "",
	email: "",
	phone: "",
	subject: "",
	message: "",
	website: "",
};

const FIELD_CLASS =
	"w-full border border-(--color-surface-border) bg-white px-5 py-4 text-[1.5rem] " +
	"text-(--color-ink) placeholder:text-(--color-surface-muted)/70 transition-colors " +
	"focus:border-(--color-ink) focus:outline-none aria-[invalid=true]:border-red-500";

const ContactForm = () => {
	const t = useTranslations("ContactPage");
	const SUBJECTS = getSubjects(t);
	const [form, setForm] = useState<FormState>(EMPTY);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [sent, setSent] = useState(false);

	const send = useMutation({
		mutationFn: () =>
			sendContactMessage({
				name: form.name.trim(),
				email: form.email.trim(),
				phone: form.phone.trim() || undefined,
				subject: form.subject || undefined,
				message: form.message.trim(),
				website: form.website,
			}),
		onSuccess: () => {
			setForm(EMPTY);
			setErrors({});
			setSent(true);
		},
		onError: (error) => {
			setErrors(error instanceof StoreApiError ? (error.details ?? {}) : {});
		},
	});

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setForm((current) => ({ ...current, [key]: value }));
		// L'erreur d'un champ disparaît dès qu'on le corrige, plutôt que
		// d'attendre un nouvel envoi.
		if (errors[key]) {
			setErrors((current) =>
				Object.fromEntries(
					Object.entries(current).filter(([field]) => field !== key),
				),
			);
		}
	};

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		setSent(false);
		send.mutate();
	};

	const error = (field: keyof FormState) => errors[field]?.[0];

	if (sent) {
		return (
			<div className="bg-(--color-surface-card) px-8 py-16 text-center sm:px-14">
				<span
					aria-hidden="true"
					className="mx-auto mb-8 flex size-[5.6rem] items-center justify-center rounded-full bg-(--color-ink)"
				>
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m5 13 4 4L19 7" />
					</svg>
				</span>

				<h3 className="mb-4 text-[2.8rem]! font-normal! [font-family:var(--font-display)]!">
					{t("success.title")}
				</h3>

				<p className="mx-auto max-w-[46ch] text-[1.5rem] leading-relaxed text-(--color-ink)/75">
					{t("success.description")}
				</p>

				<button
					type="button"
					onClick={() => setSent(false)}
					className="mt-10 text-[1.4rem] font-medium underline underline-offset-4 hover:no-underline cursor-pointer text-(--color-ink)"
				>
					{t("success.newMessage")}
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate className="space-y-8">
			{/*
			 * Piège à robots. `aria-hidden` et `tabIndex={-1}` le retirent aussi
			 * bien de l'affichage que du parcours clavier et des lecteurs
			 * d'écran : seul un automate le remplit.
			 */}
			<div
				className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
				aria-hidden="true"
			>
				<label htmlFor="website">{t("form.honeypotLabel")}</label>
				<input
					id="website"
					name="website"
					type="text"
					tabIndex={-1}
					autoComplete="off"
					value={form.website}
					onChange={(event) => set("website", event.target.value)}
				/>
			</div>

			<div className="grid gap-8 sm:grid-cols-2">
				<div>
					<label
						htmlFor="contact-name"
						className="mb-2 block text-[1.3rem] font-medium text-(--color-ink)"
					>
						{t("form.nameLabel")} <span className="text-red-600">*</span>
					</label>
					<input
						id="contact-name"
						type="text"
						required
						autoComplete="name"
						value={form.name}
						aria-invalid={Boolean(error("name"))}
						onChange={(event) => set("name", event.target.value)}
						placeholder={t("form.namePlaceholder")}
						className={FIELD_CLASS}
					/>
					{error("name") && (
						<p className="mt-2 text-[1.3rem] text-red-600">
							{error("name")}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contact-email"
						className="mb-2 block text-[1.3rem] font-medium text-(--color-ink)"
					>
						{t("form.emailLabel")} <span className="text-red-600">*</span>
					</label>
					<input
						id="contact-email"
						type="email"
						required
						autoComplete="email"
						value={form.email}
						aria-invalid={Boolean(error("email"))}
						onChange={(event) => set("email", event.target.value)}
						placeholder={t("form.emailPlaceholder")}
						className={FIELD_CLASS}
					/>
					{error("email") && (
						<p className="mt-2 text-[1.3rem] text-red-600">
							{error("email")}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contact-phone"
						className="mb-2 block text-[1.3rem] font-medium text-(--color-ink)"
					>
						{t("form.phoneLabel")}
					</label>
					<input
						id="contact-phone"
						type="tel"
						autoComplete="tel"
						value={form.phone}
						onChange={(event) => set("phone", event.target.value)}
						placeholder="+225 07 00 00 00"
						className={FIELD_CLASS}
					/>
				</div>

				<div>
					<label
						htmlFor="contact-subject"
						className="mb-2 block text-[1.3rem] font-medium text-(--color-ink)"
					>
						{t("form.subjectLabel")}
					</label>
					<select
						id="contact-subject"
						value={form.subject}
						onChange={(event) => set("subject", event.target.value)}
						className={`${FIELD_CLASS} cursor-pointer appearance-none`}
					>
						<option value="">{t("form.subjectPlaceholder")}</option>
						{SUBJECTS.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label
					htmlFor="contact-message"
					className="mb-2 block text-[1.3rem] font-medium text-(--color-ink)"
				>
					{t("form.messageLabel")} <span className="text-red-600">*</span>
				</label>
				<textarea
					id="contact-message"
					required
					rows={7}
					value={form.message}
					aria-invalid={Boolean(error("message"))}
					onChange={(event) => set("message", event.target.value)}
					placeholder={t("form.messagePlaceholder")}
					className={`${FIELD_CLASS} resize-y`}
				/>
				{error("message") && (
					<p className="mt-2 text-[1.3rem] text-red-600">
						{error("message")}
					</p>
				)}
			</div>

			{send.isError && Object.keys(errors).length === 0 && (
				<p
					role="alert"
					className="bg-red-50 px-6 py-4 text-[1.4rem] text-red-700"
				>
					{send.error instanceof Error
						? send.error.message
						: t("form.sendError")}
				</p>
			)}

			<div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-[1.3rem] text-(--color-surface-muted)">
					{t("form.responseTime")}
				</p>

				<button
					type="submit"
					disabled={send.isPending}
					className="inline-flex items-center justify-center bg-(--color-ink) px-12 py-4 text-[1.35rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
				>
					{send.isPending ? t("form.sending") : t("form.submit")}
				</button>
			</div>
		</form>
	);
};

export default ContactForm;
