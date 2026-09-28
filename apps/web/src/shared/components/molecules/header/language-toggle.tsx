"use client";

import { setLocaleCookie, type AppLocale } from "@/shared/lib/locale";
import { cn } from "@prettyfull/utils";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const LOCALES: AppLocale[] = ["fr", "en"];

/** Toggle FR/EN direct dans le header - pas de modale, un clic suffit à changer de langue. */
export function LanguageToggle() {
	const locale = useLocale();
	const router = useRouter();

	const handleSelect = (next: AppLocale) => {
		if (next === locale) return;
		setLocaleCookie(next);
		router.refresh();
	};

	return (
		<div className="flex items-center rounded-full border border-gray-200 p-0.5 text-[1.2rem] font-semibold">
			{LOCALES.map((code) => (
				<button
					key={code}
					type="button"
					onClick={() => handleSelect(code)}
					aria-pressed={locale === code}
					className={cn(
						"px-2.5 py-1 rounded-full transition-colors cursor-pointer",
						locale === code
							? "bg-black text-white"
							: "text-gray-500 hover:text-gray-800",
					)}
				>
					{code.toUpperCase()}
				</button>
			))}
		</div>
	);
}

export default LanguageToggle;
