# 🔐 Guide d'Authentification - PrettyFull Admin

Ce guide explique l'implémentation complète de l'authentification avec **Better Auth** dans l'application admin.

## 📁 Structure des fichiers

```
apps/admin/src/
├── hooks/
│   ├── use-auth.ts                    # Hook principal d'authentification
│   └── use-auth-redirect.ts           # Redirections automatiques
├── schemas/
│   └── auth-schema.ts                 # Validation Zod pour les formulaires
├── components/ui/
│   └── toast.tsx                      # Système de notifications
├── shared/lib/
│   ├── auth-client.ts                 # Client Better Auth configuré
│   └── auth-server.ts                 # Utilitaires server-side
└── pages/auth/
    ├── login.jsx                      # Page de connexion
    └── register.jsx                   # Page d'inscription
```

## 🚀 Utilisation

### 1. Wrap votre application avec le ToastProvider

Dans votre `_app.js` ou layout principal :

```jsx
import { ToastProvider } from "@/components/ui/toast";

function MyApp({ Component, pageProps }) {
	return (
		<ToastProvider>
			<Component {...pageProps} />
		</ToastProvider>
	);
}
```

### 2. Hook useAuth - Gestion de l'authentification

```jsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
	const {
		user, // Utilisateur connecté
		isAuthenticated, // Booléen d'authentification
		isLoading, // État de chargement
		error, // Erreur éventuelle
		login, // Fonction de connexion
		register, // Fonction d'inscription
		logout, // Fonction de déconnexion
		refreshSession, // Rafraîchir la session
	} = useAuth();

	// Connexion
	const handleLogin = async () => {
		const result = await login({
			email: "user@example.com",
			password: "password123",
			rememberMe: true,
		});

		if (result.success) {
			console.log("Connecté !", result.data);
		} else {
			console.error("Erreur:", result.error);
		}
	};

	// Inscription
	const handleRegister = async () => {
		const result = await register({
			name: "John",
			lastName: "Doe",
			email: "john@example.com",
			password: "SecurePass123!",
			acceptTerms: true,
		});

		if (result.success) {
			console.log("Inscrit !", result.data);
		} else {
			console.error("Erreur:", result.error);
		}
	};

	// Déconnexion
	const handleLogout = async () => {
		await logout();
	};

	return (
		<div>
			{isAuthenticated ? (
				<div>
					<p>Bienvenue {user?.name}</p>
					<button onClick={handleLogout}>Se déconnecter</button>
				</div>
			) : (
				<button onClick={handleLogin}>Se connecter</button>
			)}
		</div>
	);
}
```

### 3. Protection de routes

#### Rediriger si authentifié (pages login/register)

```jsx
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

function LoginPage() {
	// Redirige vers /profile si déjà connecté
	useAuthRedirect("/profile");

	return <LoginForm />;
}
```

#### Protéger une page (nécessite authentification)

```jsx
import { useRequireAuth } from "@/hooks/use-auth-redirect";

function ProfilePage() {
	// Redirige vers /auth/login si non connecté
	const { session, isPending } = useRequireAuth("/auth/login");

	if (isPending) return <div>Chargement...</div>;

	return <div>Profil de {session.user.name}</div>;
}
```

### 4. Système de Toast (Notifications)

```jsx
import { useToast } from "@/components/ui/toast";

function MyComponent() {
	const { showToast } = useToast();

	const handleAction = () => {
		// Types: "success", "error", "info", "warning"
		showToast("Opération réussie !", "success", 5000);
		showToast("Une erreur est survenue", "error");
		showToast("Information importante", "info");
		showToast("Attention !", "warning");
	};

	return <button onClick={handleAction}>Afficher toast</button>;
}
```

### 5. Validation de formulaires

Les schémas Zod sont déjà définis dans `schemas/auth-schema.ts` :

```jsx
import { loginSchema, registerSchema } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function MyForm() {
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = (data) => {
		// Data est automatiquement validé
		console.log(data);
	};

	return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

## 🔧 Configuration

### Variables d'environnement

Dans `.env` :

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:7777/api/v1/auth/
```

### Auth Client Configuration

Le client Better Auth est configuré dans `shared/lib/auth-client.ts` avec les champs additionnels :

- `lastName` (string, requis)
- `phone` (string, optionnel)
- `role` (string, défaut: "user")
- `status` (string, défaut: "active")
- `preferredLanguage` (string, défaut: "fr")
- `preferredCurrency` (string, défaut: "XOF")
- `country` (string, défaut: "CI")
- `dateOfBirth` (date, optionnel)
- `lastLoginAt` (date, optionnel)

## 📋 Schémas de validation

### Login

- **email** : Format email valide, requis
- **password** : Minimum 6 caractères, requis
- **rememberMe** : Booléen, optionnel

### Register

- **name** : 2-50 caractères, requis
- **lastName** : 2-50 caractères, requis
- **email** : Format email valide, requis
- **password** : Minimum 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre
- **acceptTerms** : Doit être `true`

## 🎨 Exemples d'utilisation avancée

### Vérifier le rôle de l'utilisateur

```jsx
const { user, isAuthenticated } = useAuth();

if (isAuthenticated && user?.role === "admin") {
	// Afficher interface admin
}
```

### Gérer les erreurs de manière granulaire

```jsx
const { login, error, setError } = useAuth();

const handleLogin = async (data) => {
	setError(null); // Réinitialiser l'erreur
	const result = await login(data);

	if (!result.success) {
		// Gérer différents types d'erreurs
		if (result.error.includes("Email ou mot de passe incorrect")) {
			// Action spécifique
		}
	}
};
```

### Rafraîchir la session

```jsx
const { refreshSession } = useAuth();

useEffect(() => {
	// Rafraîchir la session toutes les 5 minutes
	const interval = setInterval(
		() => {
			refreshSession();
		},
		5 * 60 * 1000
	);

	return () => clearInterval(interval);
}, [refreshSession]);
```

## 🔒 Sécurité

- ✅ Validation côté client (Zod) et serveur (Better Auth)
- ✅ Mots de passe hashés avec bcrypt
- ✅ Sessions sécurisées avec cookies httpOnly
- ✅ Protection CSRF intégrée
- ✅ Rate limiting sur les endpoints sensibles
- ✅ Messages d'erreur génériques pour éviter l'énumération

## 🐛 Dépannage

### La session n'est pas persistée

Vérifiez que `NEXT_PUBLIC_BETTER_AUTH_URL` pointe vers le bon backend.

### Les cookies ne sont pas envoyés

Assurez-vous que le frontend et le backend sont sur le même domaine ou configurez CORS correctement.

### Erreur "useToast must be used within ToastProvider"

Wrappez votre application avec `<ToastProvider>`.

## 📚 Ressources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
