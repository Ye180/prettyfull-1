// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// // type ToastType = "success" | "error" | "info" | "warning";

// // interface Toast {
// // 	id: string;
// // 	message: string;
// // 	type: ToastType;
// // 	duration?: number;
// // }

// // interface ToastContextType {
// // 	toasts: Toast[];
// // 	showToast: (message: string, type?: ToastType, duration?: number) => void;
// // 	hideToast: (id: string) => void;
// // }

// const ToastContext = createContext(undefined);

// export function ToastProvider({ children }) {
// 	const [toasts, setToasts] = useState([]);

// 	const showToast = (message, type = "info", duration = 5000) => {
// 		const id = Math.random().toString(36).substr(2, 9);
// 		const newToast = { id, message, type, duration };

// 		setToasts((prev) => [...prev, newToast]);

// 		if (duration > 0) {
// 			setTimeout(() => {
// 				hideToast(id);
// 			}, duration);
// 		}
// 	};

// 	const hideToast = (id) => {
// 		setToasts((prev) => prev.filter((toast) => toast.id !== id));
// 	};

// 	return (
// 		<ToastContext.Provider value={{ toasts, showToast, hideToast }}>
// 			{children}
// 			<ToastContainer toasts={toasts} onClose={hideToast} />
// 		</ToastContext.Provider>
// 	);
// }

// export function useToast() {
// 	const context = useContext(ToastContext);
// 	if (!context) {
// 		throw new Error("useToast must be used within ToastProvider");
// 	}
// 	return context;
// }

// function ToastContainer({ toasts, onClose }) {
// 	if (toasts.length === 0) return null;

// 	return (
// 		<div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
// 			{toasts.map((toast) => (
// 				<ToastItem key={toast.id} toast={toast} onClose={onClose} />
// 			))}
// 		</div>
// 	);
// }

// function ToastItem({ toast, onClose }) {
// 	const [isVisible, setIsVisible] = useState(false);

// 	useEffect(() => {
// 		// Animation d'entrée
// 		setTimeout(() => setIsVisible(true), 10);
// 	}, []);

// 	const handleClose = () => {
// 		setIsVisible(false);
// 		setTimeout(() => onClose(toast.id), 300);
// 	};

// 	const bgColors = {
// 		success: "bg-green-500",
// 		error: "bg-red-500",
// 		info: "bg-blue-500",
// 		warning: "bg-yellow-500",
// 	};

// 	const icons = {
// 		success: "✓",
// 		error: "✕",
// 		info: "ℹ",
// 		warning: "⚠",
// 	};

// 	return (
// 		<div
// 			className={`
// 				transform transition-all duration-300 ease-in-out
// 				${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
// 				${bgColors[toast.type]} text-white
// 				px-4 py-3 rounded-lg shadow-lg
// 				flex items-center justify-between gap-3
// 				min-w-[300px] max-w-md
// 			`}
// 		>
// 			<div className="flex items-center gap-3">
// 				<span className="text-xl font-bold">{icons[toast.type]}</span>
// 				<p className="text-sm font-medium">{toast.message}</p>
// 			</div>
// 			<button
// 				onClick={handleClose}
// 				className="text-white transition-colors hover:text-gray-200"
// 				aria-label="Fermer"
// 			>
// 				<svg
// 					className="w-4 h-4"
// 					fill="none"
// 					stroke="currentColor"
// 					viewBox="0 0 24 24"
// 				>
// 					<path
// 						strokeLinecap="round"
// 						strokeLinejoin="round"
// 						strokeWidth={2}
// 						d="M6 18L18 6M6 6l12 12"
// 					/>
// 				</svg>
// 			</button>
// 		</div>
// 	);
// }
