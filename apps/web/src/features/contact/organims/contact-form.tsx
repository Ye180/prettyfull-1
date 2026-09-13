"use client";

import { StoreApiError, sendContactMessage } from "@/lib/store-api";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { SUBJECTS } from "../data";

/**
 * Formulaire de contact.
 *
 * Les messages sont enregistrés côté API et relevés depuis le back-office —
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
	"w-full rounded-xl border border-neutral-300 bg-white px-6 py-5 text-[1.6rem] " +
	"font-light text-black placeholder:text-neutral-400 font-manrope transition-colors " +
	"focus:border-black focus:outline-none aria-[invalid=true]:border-red-500";

const ContactForm = () => {
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
				Object.fromEntries(Object.entries(current).filter(([field]) => field !== key)),
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
			<div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-8 py-16 text-center sm:px-14">
				<span
					aria-hidden="true"
					className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-black"
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

				<h3 className="mb-4 font-bebas-neue text-[3.2rem]! leading-none tracking-wide uppercase">
					Message envoyé
				</h3>

				<p className="mx-auto max-w-[46ch] text-[1.6rem] font-light leading-relaxed text-neutral-600 font-manrope">
					Nous vous répondons sous 24 heures ouvrées, à l’adresse que vous avez
					indiquée.
				</p>

				<button
					type="button"
					onClick={() => setSent(false)}
					className="mt-10 text-[1.5rem] font-medium underline underline-offset-4 font-manrope hover:no-underline cursor-pointer"
				>
					Écrire un autre message
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
			<div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
				<label htmlFor="website">Ne pas remplir</label>
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
						className="mb-3 block text-[1.4rem] font-medium uppercase tracking-wider font-manrope"
					>
						Nom <span className="text-red-600">*</span>
					</label>
					<input
						id="contact-name"
						type="text"
						required
						autoComplete="name"
						value={form.name}
						aria-invalid={Boolean(error("name"))}
						onChange={(event) => set("name", event.target.value)}
						placeholder="Aminata Sow"
						className={FIELD_CLASS}
					/>
					{error("name") && (
						<p className="mt-2 text-[1.3rem] text-red-600 font-manrope">{error("name")}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contact-email"
						className="mb-3 block text-[1.4rem] font-medium uppercase tracking-wider font-manrope"
					>
						E-mail <span className="text-red-600">*</span>
					</label>
					<input
						id="contact-email"
						type="email"
						required
						autoComplete="email"
						value={form.email}
						aria-invalid={Boolean(error("email"))}
						onChange={(event) => set("email", event.target.value)}
						placeholder="vous@exemple.com"
						className={FIELD_CLASS}
					/>
					{error("email") && (
						<p className="mt-2 text-[1.3rem] text-red-600 font-manrope">{error("email")}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contact-phone"
						className="mb-3 block text-[1.4rem] font-medium uppercase tracking-wider font-manrope"
					>
						Téléphone
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
						className="mb-3 block text-[1.4rem] font-medium uppercase tracking-wider font-manrope"
					>
						Sujet
					</label>
					<select
						id="contact-subject"
						value={form.subject}
						onChange={(event) => set("subject", event.target.value)}
						className={`${FIELD_CLASS} cursor-pointer appearance-none`}
					>
						<option value="">Choisir un sujet…</option>
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
					className="mb-3 block text-[1.4rem] font-medium uppercase tracking-wider font-manrope"
				>
					Message <span className="text-red-600">*</span>
				</label>
				<textarea
					id="contact-message"
					required
					rows={7}
					value={form.message}
					aria-invalid={Boolean(error("message"))}
					onChange={(event) => set("message", event.target.value)}
					placeholder="Dites-nous en quoi nous pouvons vous aider."
					className={`${FIELD_CLASS} resize-y`}
				/>
				{error("message") && (
					<p className="mt-2 text-[1.3rem] text-red-600 font-manrope">{error("message")}</p>
				)}
			</div>

			{send.isError && Object.keys(errors).length === 0 && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 px-6 py-4 text-[1.5rem] text-red-700 font-manrope"
				>
					{send.error instanceof Error
						? send.error.message
						: "L'envoi a échoué. Réessayez dans un instant."}
				</p>
			)}

			<div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-[1.3rem] font-light text-neutral-500 font-manrope">
					Réponse sous 24 h ouvrées.
				</p>

				<button
					type="submit"
					disabled={send.isPending}
					className="inline-flex items-center justify-center rounded-full bg-black px-12 py-5 text-[1.5rem] font-medium text-white transition-colors hover:bg-neutral-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-manrope"
				>
					{send.isPending ? "Envoi en cours…" : "Envoyer le message"}
				</button>
			</div>
		</form>
	);
};

export default ContactForm;
