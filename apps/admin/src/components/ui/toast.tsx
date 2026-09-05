"use client";

import { cn } from "@prettyfull/utils";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { IconCheck, IconAlert, IconX } from "@/components/icons";

/**
 * Notifications éphémères.
 *
 * Un retour visible après chaque action d'écriture : sans lui, un ajustement
 * de stock réussi et un ajustement silencieusement refusé se ressemblent.
 */

type ToastTone = "success" | "error" | "info";

interface Toast {
	id: number;
	tone: ToastTone;
	message: string;
}

interface ToastContextValue {
	notify: (message: string, tone?: ToastTone) => void;
	/** Raccourci pour les erreurs d'API, qui portent déjà leur message. */
	notifyError: (error: unknown, fallback?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5_000;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const dismiss = useCallback((id: number) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
	}, []);

	const notify = useCallback(
		(message: string, tone: ToastTone = "success") => {
			const id = Date.now() + Math.random();
			setToasts((current) => [...current, { id, tone, message }]);
			setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
		},
		[dismiss],
	);

	const notifyError = useCallback(
		(error: unknown, fallback = "L'opération a échoué.") => {
			const message = error instanceof Error ? error.message : fallback;
			notify(message, "error");
		},
		[notify],
	);

	const value = useMemo(() => ({ notify, notifyError }), [notify, notifyError]);

	return (
		<ToastContext.Provider value={value}>
			{children}

			<div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						role="status"
						className={cn(
							"pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3 py-2.5 shadow-lg",
							"bg-raised border-line",
						)}
					>
						<span
							className={cn(
								"mt-0.5 shrink-0",
								toast.tone === "success" && "text-success",
								toast.tone === "error" && "text-danger",
								toast.tone === "info" && "text-info",
							)}
						>
							{toast.tone === "error" ? (
								<IconAlert width={16} height={16} />
							) : (
								<IconCheck width={16} height={16} />
							)}
						</span>

						<p className="flex-1 text-[13px] text-ink">{toast.message}</p>

						<button
							type="button"
							onClick={() => dismiss(toast.id)}
							className="shrink-0 text-subtle hover:text-ink"
							aria-label="Fermer"
						>
							<IconX width={14} height={14} />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextValue => {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast doit être utilisé dans un ToastProvider.");
	return context;
};
