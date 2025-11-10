import { signOut } from "@/shared/lib/auth-client";

export default function Profile() {
	// initial undefined distinguishes "loading" from "no session"
	// const [session, setSession] = useState(undefined); // undefined = loading
	// const router = useRouter();
	// const hasFetched = useRef(false);

	// useEffect(() => {
	// 	if (hasFetched.current) return;
	// 	hasFetched.current = true;
	// 	let cancelled = false;
	// 	getSession().then((s) => {
	// 		if (!cancelled) setSession(s);
	// 	});
	// 	return () => {
	// 		cancelled = true;
	// 	};
	// }, []);

	// useEffect(() => {
	// 	// Rediriger une seule fois si pas connecté et pas déjà sur /auth/login
	// 	if (session === null && router.pathname !== "/auth/login") {
	// 		router.replace("/auth/login");
	// 	}
	// }, [session, router]);

	// if (session === undefined) {
	// 	console.log("Session utilisateur :", session);
	// 	return <div>Chargement...</div>;
	// }

	// console.log("Session utilisateur :", session);

	// // If session resolved but user missing -> redirect (failsafe)
	// if (session && !session.user) {
	// 	router.replace("/auth/login");
	// 	return null;
	// }

	// if (session === null) {
	// 	return (
	// 		<div>
	// 			<h2>Connexion requise</h2>
	// 			<button
	// 				onClick={async () => {
	// 					const res = await signIn({
	// 						email: "demo@user.com",
	// 						password: "password123",
	// 					});
	// 					if (res?.user) {
	// 						setSession(res); // store session data
	// 						router.replace("/profile");
	// 					}
	// 				}}
	// 			>
	// 				Se connecter
	// 			</button>
	// 		</div>
	// 	);
	// }

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
