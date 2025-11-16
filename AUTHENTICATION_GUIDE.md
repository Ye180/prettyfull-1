# 🔐 Guide Complet d'Authentification avec Better Auth

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Configuration Backend](#configuration-backend)
4. [Configuration Frontend](#configuration-frontend)
5. [Utilisation](#utilisation)
6. [Sécurité & Redirections](#sécurité--redirections)
7. [API Reference](#api-reference)
8. [Tests](#tests)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

Ce projet utilise **Better Auth v1.3.34** pour gérer l'authentification complète avec :

- ✅ Authentification Email/Password
- ✅ Sessions sécurisées avec cookies
- ✅ Protection des routes (middleware Next.js)
- ✅ Gestion côté client et serveur
- ✅ Champs utilisateur personnalisés
- ✅ Support OAuth (Google, Facebook - prêt)
- ✅ Multi-sessions
- ✅ Rôles et permissions (admin plugin)

**Stack Technique :**

- **Backend :** NestJS avec `@thallesp/nestjs-better-auth`
- **Frontend :** Next.js 15 avec App Router
- **Database :** MongoDB avec adapter Better Auth
- **Session Storage :** Cookies sécurisés

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                                                                   │
│  ┌────────────────────┐         ┌─────────────────────────┐    │
│  │  Client Components │         │   Server Components      │    │
│  │                    │         │                          │    │
│  │  • authClient      │         │  • getServerSession()    │    │
│  │  • useSession()    │         │  • requireAuth()         │    │
│  │  • signIn()        │         │  • getCurrentUser()      │    │
│  │  • signOut()       │         │                          │    │
│  └────────────────────┘         └─────────────────────────┘    │
│           │                                │                     │
│           │                                │                     │
│           └────────────────┬───────────────┘                     │
│                            │                                     │
│                   ┌────────▼──────────┐                         │
│                   │   Middleware      │                         │
│                   │  • Route Guard    │                         │
│                   │  • Redirections   │                         │
│                   └────────┬──────────┘                         │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼──────────┐
                    │  Better Auth API  │
                    │  /api/v1/auth/*   │
                    └────────┬──────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      BACKEND (NestJS)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              auth.ts (Better Auth Config)             │    │
│  │  • MongoDB Adapter                                    │    │
│  │  • User Additional Fields                             │    │
│  │  • Plugins (admin, multiSession)                      │    │
│  │  • OAuth Providers                                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                            │                                   │
│                   ┌────────▼──────────┐                       │
│                   │   MongoDB Atlas   │                       │
│                   │  • users          │                       │
│                   │  • sessions       │                       │
│                   │  • accounts       │                       │
│                   │  • verifications  │                       │
│                   └───────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration Backend

### 1. Fichier Principal : `apps/backend/src/auth.ts`

Ce fichier configure Better Auth pour le backend.

#### Configuration MongoDB

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, multiSession } from "better-auth/plugins";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let mongoClient: MongoClient | null = null;
let db: any = null;

function getMongoDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }
    mongoClient = new MongoClient(databaseUrl);
    mongoClient.connect().catch((error) => {
      throw error;
    });
    db = mongoClient.db();
  }
  return db;
}
```

#### Champs Utilisateur Personnalisés

```typescript
export const userAdditionalFields = {
  lastName: {
    type: "string",
    required: true,
    defaultValue: "",
  },
  phone: {
    type: "string",
    required: false,
  },
  role: {
    type: "string",
    required: false,
    defaultValue: "user",
  },
  status: {
    type: "string",
    required: false,
    defaultValue: "active",
  },
  preferredLanguage: {
    type: "string",
    required: false,
    defaultValue: "fr",
  },
  preferredCurrency: {
    type: "string",
    required: false,
    defaultValue: "XOF",
  },
  country: {
    type: "string",
    required: false,
    defaultValue: "CI",
  },
  dateOfBirth: {
    type: "date",
    required: false,
  },
  lastLoginAt: {
    type: "date",
    required: false,
  },
};
```

#### Configuration Better Auth

```typescript
export const auth = betterAuth({
  database: mongodbAdapter(getMongoDb()),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:7777",
  basePath: "/api/v1/auth",

  trustedOrigins: (
    process.env.BETTER_AUTH_TRUSTED_ORIGINS || "http://localhost:3000"
  ).split(","),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  user: {
    additionalFields: userAdditionalFields,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      enabled: !!process.env.FACEBOOK_CLIENT_ID,
    },
  },

  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60, // 1 heure
    }),
    multiSession(),
  ],

  hooks: {},

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
```

### 2. Variables d'Environnement Backend

**Fichier : `apps/backend/.env`**

```env
# Database
DATABASE_URL="mongodb://localhost:27017/prettyfull-ecommerce"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:7777"
BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:3000,http://localhost:3002"

# OAuth (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
```

### 3. Intégration NestJS

**Module Principal : `apps/backend/src/app.module.ts`**

```typescript
import { Module } from "@nestjs/common";
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
    }),
    // ... autres modules
  ],
})
export class AppModule {}
```

### 4. Protection des Routes Backend

**Dans vos controllers :**

```typescript
import { Controller, Get } from "@nestjs/common";
import { AllowAnonymous, Session, Roles } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";

@Controller("products")
export class ProductsController {
  // Route publique
  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.productsService.findAll();
  }

  // Route protégée (authentification requise)
  @Get("my-products")
  async findMyProducts(@Session() session: UserSession) {
    return this.productsService.findByUser(session.user.id);
  }

  // Route admin uniquement
  @Post()
  @Roles(["admin"])
  async create(@Session() session: UserSession, @Body() dto: CreateProductDto) {
    return this.productsService.create(dto, session.user.id);
  }
}
```

---

## Configuration Frontend

### 1. Client Auth : `apps/web/src/shared/lib/auth.client.ts`

Configuration du client Better Auth pour les **Client Components**.

```typescript
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        lastName: { type: "string", required: true, defaultValue: "" },
        phone: { type: "string", required: false },
        role: { type: "string", required: false, defaultValue: "user" },
        status: { type: "string", required: false, defaultValue: "active" },
        preferredLanguage: {
          type: "string",
          required: false,
          defaultValue: "fr",
        },
        preferredCurrency: {
          type: "string",
          required: false,
          defaultValue: "XOF",
        },
        country: { type: "string", required: false, defaultValue: "CI" },
        dateOfBirth: { type: "date", required: false },
        lastLoginAt: { type: "date", required: false },
      },
    }),
  ],
});

// Exports pour faciliter l'utilisation
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const getSession = authClient.getSession;
```

### 2. Server Auth : `apps/web/src/shared/lib/auth.server.ts`

Utilitaires pour récupérer la session dans les **Server Components**.

```typescript
import { cookies } from "next/headers";
import { cache } from "react";

export interface ExtendedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  country?: string;
  dateOfBirth?: Date;
  lastLoginAt?: Date;
}

export interface Session {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * Récupère la session côté serveur (cached par requête)
 */
export const getServerSession = cache(async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/get-session`,
      {
        method: "GET",
        headers: {
          Cookie: `better-auth.session_token=${sessionToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching server session:", error);
    return null;
  }
});

/**
 * Vérifie l'authentification
 */
export async function requireAuth(): Promise<Session | null> {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

/**
 * Récupère uniquement l'utilisateur
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}
```

### 3. Hooks de Redirection : `apps/web/src/shared/hooks/use-auth-redirect.ts`

```typescript
"use client";

import { authClient } from "../lib/auth.client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirige les utilisateurs DÉJÀ connectés
 * À utiliser dans les pages login/register
 */
export function useAuthRedirect(redirectTo: string = "/account") {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isPending };
}

/**
 * Redirige les utilisateurs NON connectés
 * À utiliser dans les pages protégées côté client
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isPending };
}
```

### 4. Middleware : `apps/web/src/routing-intl.middleware.ts`

Protection automatique des routes avec support i18n.

```typescript
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr"] as const;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Gestion de la locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let pathWithoutLocale = pathname;
  if (pathnameHasLocale) {
    const locale = locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  }

  // Routes protégées
  const protectedRoutes = ["/account", "/wishlist", "/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Routes d'authentification
  const authRoutes = ["/login", "/create-account"];
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Redirection : utilisateur connecté sur page auth → /account
  if (sessionToken && isAuthRoute) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}/account`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirection : utilisateur non connecté sur route protégée → /login
  if (!sessionToken && isProtectedRoute) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirection locale si nécessaire
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/:path*"],
};
```

### 5. Variables d'Environnement Frontend

**Fichier : `apps/web/.env`**

```env
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:7777/api/v1/auth"
```

---

## Utilisation

### 1. Formulaire de Login (Client Component)

**Fichier : `apps/web/src/features/auth/components/forms/login-form.tsx`**

```typescript
"use client";

import { signIn } from "@/shared/lib/auth.client";
import { useAuthRedirect } from "@/shared/hooks/use-auth-redirect";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas/login.schema";

export function LoginForm() {
  const router = useRouter();

  // Redirige si déjà connecté
  useAuthRedirect("/account");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Login error:", error);
      return;
    }

    // Redirection après succès
    router.push("/account");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Vos champs de formulaire */}
    </form>
  );
}
```

### 2. Formulaire d'Inscription (Client Component)

```typescript
"use client";

import { authClient } from "@/shared/lib/auth.client";
import { useAuthRedirect } from "@/shared/hooks/use-auth-redirect";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  useAuthRedirect("/account");

  const onSubmit = async (data: RegisterFormData) => {
    const { error } = await authClient.signUp.email({
      name: data.firstName,
      email: data.email,
      password: data.password,
      lastName: data.lastName,
    });

    if (error) {
      console.error("Registration error:", error);
      return;
    }

    router.push("/account");
  };

  // ... reste du formulaire
}
```

### 3. Page Protégée (Server Component)

**Fichier : `apps/web/src/app/(home)/(informations)/account/page.tsx`**

```typescript
import { getServerSession, type ExtendedUser } from "@/shared/lib/auth.server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  // Récupérer la session côté serveur
  const session = await getServerSession();

  // Redirection si non authentifié
  if (!session?.user) {
    redirect("/login");
  }

  const user: ExtendedUser = session.user;

  return (
    <div>
      <h1>Bonjour {user.name} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
      <p>Rôle: {user.role}</p>
      {/* Affichage des données utilisateur */}
    </div>
  );
}
```

### 4. Bouton de Déconnexion (Client Component)

**Fichier : `apps/web/src/features/auth/components/logout-button.tsx`**

```typescript
"use client";

import { authClient } from "@/shared/lib/auth.client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
```

### 5. Hook de Session (Client Component)

```typescript
"use client";

import { authClient } from "@/shared/lib/auth.client";

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <p>Connecté en tant que {session.user.email}</p>
    </div>
  );
}
```

---

## Sécurité & Redirections

### Flux de Redirection

#### 1. Utilisateur NON connecté accède à `/account`

```
Requête → Middleware détecte absence de token
        → Redirection vers /login
```

#### 2. Utilisateur connecté accède à `/login`

```
Requête → Middleware détecte token
        → Redirection vers /account
```

#### 3. Login réussi

```
Formulaire → signIn.email()
           → Backend crée session + cookie
           → Client détecte session
           → router.push('/account')
```

### Routes Protégées

**Configuration dans le middleware :**

```typescript
// Routes nécessitant authentification
const protectedRoutes = ["/account", "/wishlist", "/checkout"];

// Routes réservées aux non-authentifiés
const authRoutes = ["/login", "/create-account"];
```

### Cookies de Session

- **Nom :** `better-auth.session_token`
- **HttpOnly :** Oui (sécurisé)
- **Secure :** Oui (en production)
- **SameSite :** Lax
- **Durée :** 7 jours (configurable)

---

## API Reference

### Backend Endpoints

Tous les endpoints sont préfixés par `/api/v1/auth`

#### POST `/api/v1/auth/sign-up/email`

Inscription avec email/password.

**Body :**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John",
  "lastName": "Doe",
  "role": "user",
  "preferredLanguage": "fr",
  "preferredCurrency": "XOF"
}
```

**Response :**

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe",
    "role": "user",
    ...
  },
  "session": {
    "id": "...",
    "userId": "...",
    "token": "...",
    "expiresAt": "2025-11-15T..."
  }
}
```

#### POST `/api/v1/auth/sign-in/email`

Connexion avec email/password.

**Body :**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/v1/auth/sign-out`

Déconnexion.

#### GET `/api/v1/auth/get-session`

Récupérer la session actuelle.

**Headers :**

```
Cookie: better-auth.session_token=...
```

#### GET `/api/v1/auth/sign-in/social?provider=google`

OAuth avec Google.

#### GET `/api/v1/auth/sign-in/social?provider=facebook`

OAuth avec Facebook.

### Frontend Client API

#### `authClient.useSession()`

Hook React pour obtenir la session.

```typescript
const { data: session, isPending, error } = authClient.useSession();
```

#### `signIn.email(credentials)`

Connexion email/password.

```typescript
const { data, error } = await signIn.email({
  email: "user@example.com",
  password: "password123",
});
```

#### `signUp.email(userData)`

Inscription email/password.

```typescript
const { data, error } = await authClient.signUp.email({
  name: "John",
  email: "user@example.com",
  password: "password123",
  lastName: "Doe",
});
```

#### `authClient.signOut()`

Déconnexion.

```typescript
await authClient.signOut();
```

### Frontend Server API

#### `getServerSession()`

Récupère la session dans un Server Component.

```typescript
const session = await getServerSession();
if (session) {
  console.log(session.user.email);
}
```

#### `requireAuth()`

Vérifie l'authentification.

```typescript
const session = await requireAuth();
if (!session) {
  redirect("/login");
}
```

#### `getCurrentUser()`

Récupère uniquement l'utilisateur.

```typescript
const user = await getCurrentUser();
```

---

## Tests

### 1. Test de l'Inscription

```bash
curl -X POST http://localhost:7777/api/v1/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test",
    "lastName": "User"
  }'
```

### 2. Test de la Connexion

```bash
curl -X POST http://localhost:7777/api/v1/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Test de la Session

```bash
curl -X GET http://localhost:7777/api/v1/auth/get-session \
  -b cookies.txt
```

### 4. Tests Manuels Frontend

1. **Accès à `/account` sans authentification**
   - Résultat attendu : Redirection vers `/login`

2. **Inscription via `/create-account`**
   - Résultat attendu : Création de compte + redirection vers `/account`

3. **Connexion via `/login` puis accès à `/login`**
   - Résultat attendu : Redirection immédiate vers `/account`

4. **Déconnexion depuis `/account`**
   - Résultat attendu : Redirection vers `/login`

5. **Rafraîchissement de `/account` une fois connecté**
   - Résultat attendu : Page se charge sans flash de redirection

---

## Troubleshooting

### Problème : Session non persistante après login

**Cause :** Cookies non envoyés ou domain mismatch.

**Solution :**

1. Vérifiez que `BETTER_AUTH_TRUSTED_ORIGINS` inclut votre frontend
2. Vérifiez que les cookies sont bien créés (DevTools → Application → Cookies)
3. Vérifiez que `baseURL` dans `auth.client.ts` pointe vers le bon backend

### Problème : Erreur CORS

**Cause :** Le backend n'autorise pas l'origine du frontend.

**Solution :**

```typescript
// Dans apps/backend/src/auth.ts
trustedOrigins: [
  'http://localhost:3000',
  'http://localhost:3002',
  // Ajoutez votre domaine de production
].filter(Boolean),
```

### Problème : TypeScript erreur sur les champs personnalisés

**Cause :** Types non synchronisés entre backend et frontend.

**Solution :**
Vérifiez que les champs dans `userAdditionalFields` (backend) correspondent à ceux dans `inferAdditionalFields` (frontend).

### Problème : Middleware redirige en boucle

**Cause :** Configuration incorrecte des routes protégées/publiques.

**Solution :**
Vérifiez que :

- Les routes auth (`/login`, `/create-account`) sont dans `authRoutes`
- Les routes protégées sont dans `protectedRoutes`
- Le middleware ne redirige pas vers lui-même

### Problème : MongoDB connection error

**Cause :** `DATABASE_URL` incorrecte ou MongoDB non démarré.

**Solution :**

```bash
# Vérifiez que MongoDB est lancé
mongosh

# Vérifiez la variable d'environnement
echo $DATABASE_URL
```

---

## Checklist de Production

- [ ] Changer `BETTER_AUTH_SECRET` (32+ caractères aléatoires)
- [ ] Activer `requireEmailVerification: true`
- [ ] Configurer les URLs de production dans `trustedOrigins`
- [ ] Activer `useSecureCookies: true` en production
- [ ] Configurer les credentials OAuth (Google, Facebook)
- [ ] Tester la vérification d'email
- [ ] Implémenter la réinitialisation de mot de passe
- [ ] Ajouter rate limiting sur les endpoints d'auth
- [ ] Configurer les logs d'audit
- [ ] Tester les rôles et permissions
- [ ] Sécuriser les variables d'environnement
- [ ] Activer HTTPS en production

---

## Ressources

- [Better Auth Documentation](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [NestJS Better Auth](https://github.com/thallesp/nestjs-better-auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Support

Pour toute question ou problème :

1. Consultez les logs backend : `apps/backend` terminal
2. Consultez les logs frontend : Browser DevTools → Console
3. Vérifiez les cookies : Browser DevTools → Application → Cookies
4. Vérifiez la base de données MongoDB

---

**Version :** 1.0.0  
**Dernière mise à jour :** 8 novembre 2025  
**Auteur :** Danmo
