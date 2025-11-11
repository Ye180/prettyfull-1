import { getSession, signIn, signOut } from "@/shared/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
	const [session, setSession] = useState(undefined);
	const router = useRouter();
	const hasFetched = useRef(false);

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;
		let cancelled = false;
		getSession().then((s) => !cancelled && setSession(s));
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (session === null && router.pathname !== "/auth/login") {
			router.replace("/auth/login");
		}
	}, [session, router]);

	if (session === undefined) return <div>Chargement...</div>;

	if (session && !session.user) {
		router.replace("/auth/login");
		return null;
	}

	if (session === null) {
		return (
			<div>
				<h2>Connexion requise</h2>
				<button
					onClick={async () => {
						const res = await signIn({
							email: "demo@user.com",
							password: "password123",
						});
						if (res?.user) {
							setSession(res);
							router.replace("/profile");
						}
					}}
				>
					Se connecter
				</button>
			</div>
		);
	}

	return (
		<div>
			<h1>Bienvenue {session.user?.name || "Invité"}</h1>
			<p>Email : {session.user?.email || "Inconnu"}</p>
			<button
				onClick={async () => {
					await signOut();
					setSession(null);
					router.replace("/auth/login");
				}}
			>
				Déconnexion
			</button>
		</div>
	);
}
