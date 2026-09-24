# Téléversement de fichiers avec UploadThing

Guide technique de l'intégration UploadThing utilisée dans ce projet (galerie
produit, bannières de contenu, etc.), écrit pour pouvoir être copié tel quel
dans un autre projet.

## 1. Ça sert à quoi

UploadThing est un service de stockage de fichiers (photos, documents...) qui
évite d'opérer soi-même un bucket S3 : il fournit le stockage, le CDN, et un
protocole de téléversement **direct navigateur → stockage** (le fichier ne
transite jamais par votre propre serveur).

Le rôle de votre backend n'est donc pas de recevoir le fichier, mais de
**l'autoriser** : le navigateur demande d'abord à votre API la permission de
téléverser (avec le nom, la taille et le type du fichier), votre API vérifie
que l'utilisateur a le droit de le faire, puis renvoie une URL signée vers
laquelle le navigateur envoie directement le fichier.

```
Navigateur                    Votre API (Hono/Express/...)         UploadThing
    │  1. "je veux téléverser 1.jpg" │                                   │
    │ ─────────────────────────────► │                                   │
    │                                │  2. vérifie l'auth/permission     │
    │                                │  3. demande une URL signée        │
    │                                │ ─────────────────────────────────►│
    │                                │ ◄─────────────────────────────────│
    │ ◄───────────────────────────── │  4. renvoie l'URL signée          │
    │  5. PUT du fichier directement sur l'URL signée                    │
    │ ───────────────────────────────────────────────────────────────► │
    │  6. callback serveur → serveur : UploadThing confirme la réception │
    │ ◄─────────────────────────────────────────────────────────────── │
```

Ce qu'on gagne : pas de gestion de multipart/form-data, pas de fichier qui
transite par la mémoire du serveur applicatif, une limite de taille/type posée
une fois pour toutes.

## 2. Vue d'ensemble des pièces

| Fichier                                         | Rôle                                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `apps/backend/src/modules/uploads/router.ts`    | Définit les _endpoints_ de téléversement (un par usage : catalogue, contenu...), leurs limites, et l'autorisation.           |
| `apps/backend/src/modules/uploads/routes.ts`    | Monte le routeur UploadThing sur `/api/uploadthing`, expose `/api/admin/uploads/status` et `DELETE /api/admin/uploads/:key`. |
| `apps/backend/src/index.ts`                     | CORS - **voir la section pièges**, c'est le point qui casse le plus souvent.                                                 |
| `apps/backend/src/lib/env.ts`                   | `UPLOADTHING_TOKEN`, facultative pour que le projet tourne en local sans compte de stockage.                                 |
| `apps/admin/src/lib/uploadthing.ts`             | Génère le hook client `useUploadThing` côté front.                                                                           |
| `apps/admin/src/components/ui/image-upload.tsx` | Composants réutilisables `ImageUpload` (un fichier) / `ImageUploadList` (plusieurs), avec glisser-déposer natif.             |
| `apps/admin/next.config.ts`                     | Autorise `next/image` à afficher les URL `*.ufs.sh`.                                                                         |

## 3. Installation

```bash
# Backend
pnpm --filter backend add uploadthing

# Frontend (React/Next.js)
pnpm --filter admin add uploadthing @uploadthing/react
```

Versions utilisées ici : `uploadthing@^7.7.4`, `@uploadthing/react@^7.3.3`.
Compatibles Node ≥ 18 et React ≥ 18.

## 4. Variable d'environnement

```bash
# .env (backend)
UPLOADTHING_TOKEN=
```

Le token se récupère sur le dashboard [uploadthing.com](https://uploadthing.com)
(API Keys → Secret Key), après création d'une "app". C'est une chaîne base64
qui encode `{ apiKey, appId, regions }` - ne la commitez jamais, elle donne un
accès complet au bucket.

**Rendez-la facultative** plutôt que de faire planter le boot si elle manque :
un projet doit pouvoir tourner en local sans compte de stockage, avec un repli
explicite (voir §7).

```ts
// lib/env.ts
const schema = z.object({
	// ...
	UPLOADTHING_TOKEN: z.string().optional(),
});
```

## 5. Backend - définir les endpoints (le `FileRouter`)

```ts
// modules/uploads/router.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const IMAGE_LIMITS = {
	image: { maxFileSize: "8MB", maxFileCount: 10 },
} as const;

/**
 * L'authentification se fait ICI, côté serveur - jamais côté client.
 * Le fichier part directement du navigateur vers UploadThing après cette
 * validation : c'est le seul point où l'on peut refuser un téléversement.
 */
const requireAuth = async (request: Request, permission: string) => {
	const token = extractBearerToken(request.headers.get("authorization"));
	if (!token) throw new UploadThingError("Authentification requise.");

	const auth = await verifyAccessToken(token); // votre propre vérif JWT/session
	if (!auth.permissions.includes(permission)) {
		throw new UploadThingError(`Permission requise : ${permission}.`);
	}
	return { userId: auth.sub }; // disponible dans `metadata` du callback
};

export const uploadRouter = {
	productImage: f(IMAGE_LIMITS)
		.middleware(({ req }) => requireAuth(req, "catalog.write"))
		.onUploadComplete(({ metadata, file }) => {
			// Ce que retourne cette fonction est renvoyé au client dans
			// `file.serverData` - c'est ce que le formulaire enregistre ensuite.
			return { url: file.ufsUrl, key: file.key, name: file.name };
		}),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;
```

Points importants :

- **Un endpoint par usage**, pas un seul générique - chacun a sa propre
  permission et ses propres limites (une bannière éditoriale et une photo
  produit n'ont pas les mêmes règles).
- `middleware()` lève une `UploadThingError` (jamais une erreur générique) :
  c'est la seule forme de message que le client UploadThing sait afficher à
  l'utilisateur.
- Le nom des clés de `uploadRouter` (ici `productImage`) devient le `slug`
  interrogé par le client - gardez-le synchronisé entre back et front (une
  constante partagée dans un package commun évite le risque de faute de
  frappe silencieuse, cf. `UPLOAD_ENDPOINTS` dans ce projet).

## 6. Backend - monter les routes

```ts
// modules/uploads/routes.ts
import { createRouteHandler, UTApi } from "uploadthing/server";

const isConfigured = Boolean(env.UPLOADTHING_TOKEN);

export const uploadthingRoutes = new Hono();

if (isConfigured) {
	const handlers = createRouteHandler({
		router: uploadRouter,
		config: {
			token: env.UPLOADTHING_TOKEN,
			isDev: env.NODE_ENV === "development",
		},
	});

	// UploadThing gère lui-même GET (introspection) et POST (négociation +
	// callback) sur ce chemin - on lui passe la requête brute.
	uploadthingRoutes.all("/", (c) => handlers(c.req.raw));
} else {
	uploadthingRoutes.all("/", (c) =>
		c.json({ error: { code: "UPLOAD_NOT_CONFIGURED" } }, 503),
	);
}

// Endpoint que le front interroge pour savoir s'il doit afficher la zone de
// dépôt ou un repli (champ URL manuel, etc.).
adminRoutes.get("/uploads/status", (c) => c.json({ configured: isConfigured }));

// Supprimer un fichier ne libère rien côté stockage sans cet appel explicite.
adminRoutes.delete(
	"/uploads/:key",
	requirePermission("catalog.write"),
	async (c) => {
		await new UTApi({ token: env.UPLOADTHING_TOKEN }).deleteFiles(
			c.req.param("key"),
		);
		return c.json({ success: true });
	},
);
```

```ts
// index.ts - montage
// Hors du garde d'auth global : UploadThing vérifie lui-même le jeton dans
// le middleware de SA route (§5), et gère sa propre négociation GET/POST.
app.route("/api/uploadthing", uploadthingRoutes);
```

## 7. Frontend - le hook client

```ts
// lib/uploadthing.ts
"use client";
import { generateReactHelpers } from "@uploadthing/react";
import type { FileRouter } from "uploadthing/types";

// Le routeur vit côté API ; si le front ne peut pas l'importer directement
// (monorepo avec résolutions de modules incompatibles, ou API dans un autre
// langage), on redéclare sa *forme* ici plutôt que le type exact.
type AppFileRouter = Record<"productImage", FileRouter[string]>;

export const { useUploadThing } = generateReactHelpers<AppFileRouter>({
	url: `${API_BASE_URL}/api/uploadthing`,
});

// Le jeton est évalué à l'APPEL, pas au montage du composant : un jeton
// d'accès qui tourne (refresh JWT) serait périmé si on le figeait ici.
export const uploadHeaders = (): HeadersInit => {
	const token = getAccessToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
};
```

```tsx
// Composant, principe général
const { startUpload, isUploading } = useUploadThing("productImage", {
	headers: uploadHeaders,
	onClientUploadComplete: (files) => {
		const url = files?.[0]?.serverData?.url;
		// ... enregistrer `url` dans votre formulaire
	},
	onUploadError: (error) => notifyError(error),
});

// Glisser-déposer natif, sans librairie : un <div> avec onDragOver /
// onDragLeave / onDrop qui appelle startUpload(Array.from(files)), plus un
// <input type="file" hidden> déclenché par un bouton "parcourez" pour le
// clic classique. Voir `apps/admin/src/components/ui/image-upload.tsx` pour
// l'implémentation complète (upload simple ET multiple, repli URL manuelle
// si `configured: false`, prévisualisation).
```

## 8. Next.js - afficher les images distantes

```ts
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
    { protocol: "https", hostname: "utfs.io", pathname: "/f/**" }, // ancien domaine
  ],
},
```

Nécessaire uniquement si vous utilisez `next/image`. Ce projet préfère un
`<img>` brut pour les visuels administrés (URL saisies/téléversées, donc
inconnues à la compilation) - dans ce cas cette config sert surtout à ne pas
être piégé si vous migrez vers `next/image` plus tard.

## 9. Pièges rencontrés (à ne pas refaire)

### CORS : le préflight ment

**Symptôme** : le hook affiche "Failed to report event 'upload' to UploadThing
server", l'onglet réseau montre une requête `OPTIONS` réussie (204) suivie
d'une requête réelle en erreur "CORS error" avec **zéro en-tête de réponse**
visible.

**Cause réelle** : le client UploadThing envoie des en-têtes personnalisés
(`x-uploadthing-package`, `x-uploadthing-version`), et Next.js ajoute de
lui-même des en-têtes de propagation de trace (`traceparent`, `b3`) à tout
`fetch`. Si votre middleware CORS backend a une liste `allowHeaders` figée qui
ne les contient pas, le préflight répond 204 (il "réussit") mais **sans
autoriser ces en-têtes** - le navigateur bloque alors la vraie requête et ne
l'envoie même jamais sur le réseau. Le backend ne voit donc que des `OPTIONS`
en boucle, jamais le `POST`.

**Fix** - élargir la liste d'en-têtes autorisés :

```ts
cors({
  origin: env.CORS_ORIGINS,
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "X-Uploadthing-Package",
    "X-Uploadthing-Version",
    "traceparent",
    "tracestate",
    "b3",
  ],
  allowMethods: ["GET", "POST", "OPTIONS"],
}),
```

**Pour diagnostiquer ce cas en général** (pas seulement UploadThing) : si
l'onglet réseau montre un préflight qui réussit mais jamais la requête réelle
dans les logs serveur, reproduisez le préflight à la main avec les vrais
en-têtes du navigateur :

```bash
curl -sD - -o /dev/null -X OPTIONS 'http://localhost:PORT/votre/route' \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: <copiez la liste exacte depuis devtools>" \
  | grep -i access-control-allow-headers
```

Si la réponse n'inclut pas tous les en-têtes demandés, c'est confirmé.

### Le repli sans stockage configuré

Un projet doit pouvoir démarrer sans compte UploadThing (CI, onboarding d'un
nouveau développeur, démo locale). D'où le motif `isConfigured` répété
partout : le backend répond `503 UPLOAD_NOT_CONFIGURED` plutôt que de planter
au démarrage, et le front interroge `GET /uploads/status` pour savoir s'il
affiche la zone de dépôt ou un champ de secours (URL manuelle, upload
désactivé). Ne pas sauter cette étape en pensant "de toute façon on aura
toujours un token" - c'est le genre de chose qui casse un onboarding six mois
plus tard.

### Suppression de fichier

Retirer une image d'un formulaire (côté client) ne supprime rien côté
stockage - le quota se remplit sinon de fichiers orphelins. D'où la route
`DELETE /uploads/:key` explicite, appelée quand l'utilisateur retire vraiment
un visuel (pas juste en le remplaçant dans un champ texte).

## 10. Checklist de portage vers un nouveau projet

1. Créer une app sur [uploadthing.com](https://uploadthing.com), récupérer le
   `UPLOADTHING_TOKEN`.
2. Installer `uploadthing` (backend) et `uploadthing` + `@uploadthing/react`
   (frontend).
3. Copier `router.ts` (§5) : adapter les endpoints, permissions et limites à
   votre cas.
4. Copier `routes.ts` (§6) : adapter `requirePermission`/l'auth à votre
   système.
5. Monter `/api/uploadthing` **avant** votre garde d'auth global, **avec**
   votre middleware CORS déjà en place - et vérifier `allowHeaders` (§9) tout
   de suite, avant de perdre du temps à déboguer.
6. Copier `lib/uploadthing.ts` + le composant de dépôt (§7).
7. Si `next/image` : ajouter les `remotePatterns` (§8).
8. Renseigner `UPLOADTHING_TOKEN` en local, vérifier `GET /uploads/status` →
   `{ configured: true }`, puis tester un vrai glisser-déposer avant de
   considérer l'intégration terminée.
