# Better Auth - Session Management et Redirections

## 🎯 Objectif

Mettre en place la récupération de session côté serveur avec Better Auth et gérer automatiquement les redirections :

- Utilisateurs authentifiés → redirigés vers `/account` quand ils accèdent à `/login` ou `/create-account`
- Utilisateurs non authentifiés → redirigés vers `/login` quand ils accèdent à `/account` ou d'autres routes protégées

---

## 📁 Fichiers créés

### 1. `/apps/web/src/shared/lib/auth.server.ts`

Utilitaires pour gérer la session côté **serveur** (Server Components, Server Actions, Route Handlers).

```typescript
export const getServerSession = cache(async (): Promise<Session | null> => {
  // Récupère la session depuis les cookies
  // Appelle l'API Better Auth pour valider
  // Cache le résultat pour éviter les appels multiples
});

export async function requireAuth(): Promise<Session | null> {
  // Vérifie si l'utilisateur est authentifié
  // Retourne null si non authentifié
}

export async function getCurrentUser(): Promise<ExtendedUser | null> {
  // Retourne uniquement l'utilisateur courant
}
```

**Types inclus :**

- `ExtendedUser` : Type complet avec tous les champs additionnels (lastName, phone, role, etc.)
- `Session` : Objet de session complet avec user et session info

**Usage :**

```typescript
// Dans un Server Component
const session = await getServerSession();
if (!session) redirect("/login");

// Ou
const user = await getCurrentUser();
```

---

### 2. `/apps/web/src/shared/hooks/use-auth-redirect.ts`

Hooks React pour gérer les redirections côté **client**.

```typescript
export function useAuthRedirect(redirectTo = "/account") {
  // Redirige les utilisateurs DÉJÀ connectés
  // À utiliser dans les pages login/register
}

export function useRequireAuth(redirectTo = "/login") {
  // Redirige les utilisateurs NON connectés
  // À utiliser dans les pages protégées côté client
}
```

**Usage :**

```typescript
// Dans une page de login (Client Component)
export function LoginPage() {
  useAuthRedirect("/account"); // Redirige si déjà connecté
  // ...
}
```

---

### 3. `/apps/web/src/features/auth/components/logout-button.tsx`

Composant bouton de déconnexion.

```typescript
export function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };
  // ...
}
```

---

## 🔧 Fichiers modifiés

### 1. `/apps/web/src/routing-intl.middleware.ts`

Middleware mis à jour pour gérer :

- ✅ **Routes protégées** : `/account`, `/wishlist`, `/checkout`
- ✅ **Routes d'authentification** : `/login`, `/create-account`
- ✅ **Internationalisation** : Préserve le préfixe de locale (`/fr`, `/en`)

**Logique :**

1. Si utilisateur **authentifié** ET sur page auth → redirige vers `/account`
2. Si utilisateur **non authentifié** ET sur route protégée → redirige vers `/login`
3. Sinon → laisse passer

---

### 2. `/apps/web/src/app/(home)/(informations)/account/page.tsx`

Page account transformée en **Server Component** qui :

- ✅ Récupère la session côté serveur avec `getServerSession()`
- ✅ Affiche les informations de l'utilisateur (nom, email, rôle, etc.)
- ✅ Affiche un bouton de déconnexion

**Structure :**

- Informations personnelles (grid 2 colonnes)
- Statistiques du compte (rôle, statut, dernière connexion)
- Bouton de déconnexion

---

### 3. `/apps/web/src/features/auth/components/forms/login-form.tsx`

Formulaire de connexion mis à jour avec :

- ✅ Hook `useAuthRedirect()` pour rediriger si déjà connecté
- ✅ Redirection vers `/account` après login réussi
- ✅ Gestion des erreurs améliorée

---

### 4. `/apps/web/src/features/auth/components/forms/register-form.tsx`

Formulaire d'inscription mis à jour avec :

- ✅ Hook `useAuthRedirect()` pour rediriger si déjà connecté
- ✅ Redirection vers `/account` après inscription réussie
- ✅ Envoi des champs additionnels (firstName, lastName)

---

## 🔄 Flux d'authentification

### Cas 1 : Utilisateur non connecté accède à `/account`

1. Middleware détecte l'absence de `better-auth.session_token` cookie
2. Middleware extrait le path sans locale : `/account`
3. Path est dans `protectedRoutes` → **redirection vers `/login`**

### Cas 2 : Utilisateur connecté accède à `/login`

1. Middleware détecte la présence du cookie de session
2. Path est dans `authRoutes` → **redirection vers `/account`**

### Cas 3 : Utilisateur connecté sur `/account`

1. Middleware laisse passer (session présente, route protégée OK)
2. Server Component appelle `getServerSession()`
3. API Better Auth valide le token
4. Page affiche les informations de l'utilisateur

### Cas 4 : Login réussi

1. Formulaire appelle `signIn.email()`
2. Better Auth crée une session et envoie un cookie
3. Hook `useAuthRedirect` détecte la session
4. Client redirige vers `/account`

---

## 🛠️ Configuration requise

### Variables d'environnement

**`/apps/web/.env`**

```env
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:7777/api/v1/auth"
```

---

## 🧪 Test du système

### Test 1 : Accès à `/account` sans authentification

```bash
# Ouvrir http://localhost:3000/account
# Résultat attendu : Redirection vers /login
```

### Test 2 : Login puis accès à `/login`

```bash
# 1. Se connecter via /login
# 2. Tenter d'accéder à /login
# Résultat attendu : Redirection vers /account
```

### Test 3 : Déconnexion

```bash
# 1. Sur /account, cliquer sur "Se déconnecter"
# Résultat attendu : Redirection vers /login
```

### Test 4 : Session côté serveur

```bash
# 1. Se connecter
# 2. Rafraîchir /account (F5)
# Résultat attendu : Page se charge avec les infos utilisateur (pas de flash de redirection)
```

---

## 📊 Diagramme de flux

```
┌─────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                           │
│  • Vérifie cookie better-auth.session_token             │
│  • Route protégée + pas de token → /login               │
│  • Route auth + token présent → /account                │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        │                                   │
   [Protected]                         [Auth Pages]
   /account                           /login, /create-account
        │                                   │
        ↓                                   ↓
┌───────────────────┐           ┌─────────────────────┐
│ Server Component  │           │  Client Component   │
│ getServerSession()│           │ useAuthRedirect()   │
│ Render page       │           │ Form submission     │
└───────────────────┘           └─────────────────────┘
```

---

## ✅ Checklist de fonctionnalités

- [x] Session côté serveur avec `getServerSession()`
- [x] Session côté client avec `authClient.useSession()`
- [x] Middleware de protection des routes
- [x] Hook de redirection pour pages auth
- [x] Page account avec informations utilisateur
- [x] Bouton de déconnexion fonctionnel
- [x] Redirection après login/register
- [x] Support de l'internationalisation (fr/en)
- [x] Types TypeScript complets (ExtendedUser)

---

## 🚀 Prochaines étapes

1. **Ajouter OAuth** : Implémenter les boutons Google/Apple
2. **Page de profil éditable** : Permettre la modification des infos
3. **Page de commandes** : Historique des achats
4. **Protection par rôle** : Routes admin vs user
5. **Two-Factor Authentication** : Ajouter 2FA avec Better Auth
6. **Email verification** : Activer la vérification d'email

---

## 📚 Ressources

- [Better Auth Documentation](https://better-auth.com)
- [Better Auth React Hooks](https://better-auth.com/docs/integrations/react)
- [Better Auth Server API](https://better-auth.com/docs/api/server)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
