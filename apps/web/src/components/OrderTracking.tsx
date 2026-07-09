import { useOrderTracking } from "../hooks/useOrderTracking";

/**
 * ============================================================================
 * ORDER TRACKING COMPONENT - SSE Demo
 * ============================================================================
 * Composant exemple montrant l'utilisation du hook useOrderTracking
 * Affiche le statut de commande en temps réel via SSE
 */

interface OrderTrackingProps {
	orderId: string;
	className?: string;
}

const statusIcons: Record<string, string> = {
	pending: "⏳",
	paid: "💳",
	confirmed: "✅",
	processing: "📦",
	shipped: "🚚",
	delivered: "🎉",
	cancelled: "❌",
	refunded: "💰",
};

const statusColors: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	paid: "bg-blue-100 text-blue-800",
	confirmed: "bg-green-100 text-green-800",
	processing: "bg-purple-100 text-purple-800",
	shipped: "bg-indigo-100 text-indigo-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800",
	refunded: "bg-gray-100 text-gray-800",
};

export function OrderTrackingComponent({
	orderId,
	className = "",
}: OrderTrackingProps) {
	const {
		status,
		message,
		timestamp,
		metadata,
		isConnected,
		error,
		history,
		reconnect,
	} = useOrderTracking(orderId);

	return (
		<div className={`p-6 rounded-lg border ${className}`}>
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Order Tracking</h2>
				<div className="flex gap-2 items-center">
					{isConnected ? (
						<span className="flex gap-1 items-center text-sm text-green-600">
							<span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
							Live
						</span>
					) : (
						<span className="flex gap-1 items-center text-sm text-red-600">
							<span className="w-2 h-2 bg-red-600 rounded-full"></span>
							Disconnected
						</span>
					)}
				</div>
			</div>

			{/* Order Number */}
			{metadata?.orderNumber && (
				<p className="mb-4 text-gray-600">
					Order:{" "}
					<span className="font-mono font-semibold">
						{metadata.orderNumber}
					</span>
				</p>
			)}

			{/* Current Status */}
			{status && (
				<div className="mb-6">
					<div className="flex gap-3 items-center">
						<span className="text-4xl">{statusIcons[status] || "📋"}</span>
						<div>
							<div
								className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
							>
								{status.toUpperCase()}
							</div>
							{message && <p className="mt-2 text-gray-700">{message}</p>}
							{timestamp && (
								<p className="mt-1 text-sm text-gray-500">
									{new Date(timestamp).toLocaleString("fr-FR")}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="p-4 mb-4 bg-red-50 rounded border border-red-200">
					<p className="flex gap-2 items-center text-red-800">
						<span>⚠️</span>
						{error}
					</p>
					<button
						onClick={reconnect}
						className="px-4 py-2 mt-2 text-white bg-red-600 rounded transition hover:bg-red-700"
					>
						Reconnecter
					</button>
				</div>
			)}

			{/* Status History Timeline */}
			{history.length > 0 && (
				<div className="mt-6">
					<h3 className="mb-3 text-lg font-semibold">Historique</h3>
					<div className="space-y-3">
						{history.map((item, index) => (
							<div key={index} className="flex gap-3 items-start">
								<div className="flex flex-col items-center">
									<span className="text-2xl">
										{statusIcons[item.status] || "•"}
									</span>
									{index < history.length - 1 && (
										<div className="w-0.5 h-8 bg-gray-300 my-1"></div>
									)}
								</div>
								<div className="flex-1 pb-4">
									<div
										className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}
									>
										{item.status}
									</div>
									<p className="mt-1 text-sm text-gray-700">{item.message}</p>
									<p className="mt-1 text-xs text-gray-500">
										{new Date(item.timestamp).toLocaleString("fr-FR")}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* No Status Yet */}
			{!status && !error && (
				<div className="py-8 text-center text-gray-500">
					<p>En attente de mises à jour...</p>
					<div className="mt-4">
						<div className="flex gap-2 justify-center animate-pulse">
							<div className="w-3 h-3 bg-gray-400 rounded-full"></div>
							<div className="w-3 h-3 bg-gray-400 rounded-full animation-delay-200"></div>
							<div className="w-3 h-3 bg-gray-400 rounded-full animation-delay-400"></div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default OrderTrackingComponent;
