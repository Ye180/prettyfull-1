import { useRequireAuth } from "@/hooks/use-auth-redirect";
import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/router";

export default function Profile() {
	const router = useRouter();

	// Protect this page - redirect to login if not authenticated
	const { session, isPending } = useRequireAuth("/auth/login");

	const handleLogout = async () => {
		try {
			// Call signOut - it will clear local session regardless of server response
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/auth/login");
					},
				},
			});
		} catch (error) {
			console.error("Logout error:", error);
			// Even if server call fails, redirect to login
			// The session cookie should be cleared client-side
			router.push("/auth/login");
		}
	};

	// Show loading state while checking authentication
	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<svg
						className="w-10 h-10 mx-auto mb-4 text-gray-600 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<p className="text-gray-600">Vérification de votre session...</p>
				</div>
			</div>
		);
	}

	// If no session after loading, the useRequireAuth hook will redirect
	if (!session) {
		return null;
	}

	return (
		<div className="container px-4 py-8 mx-auto">
			<div className="max-w-2xl mx-auto">
				<div className="p-6 bg-white border rounded-lg shadow-sm">
					<h1 className="mb-4 text-2xl font-bold">
						Bienvenue {session.user?.name || "Invité"}
					</h1>
					<div className="space-y-2">
						<p className="text-gray-700">
							<span className="font-medium">Email :</span>{" "}
							{session.user?.email || "Inconnu"}
						</p>
						{session.user?.lastName && (
							<p className="text-gray-700">
								<span className="font-medium">Nom :</span>{" "}
								{session.user.lastName}
							</p>
						)}
						{session.user?.role && (
							<p className="text-gray-700">
								<span className="font-medium">Rôle :</span> {session.user.role}
							</p>
						)}
					</div>
					<button
						onClick={handleLogout}
						className="px-6 py-2 mt-6 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
					>
						Déconnexion
					</button>
				</div>
			</div>
		</div>
	);
}
