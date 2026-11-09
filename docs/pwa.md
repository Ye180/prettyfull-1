# Application installable (PWA) avec Next.js

Ce guide décrit la PWA du storefront Prettyfull (`apps/web`) : installation sur l'écran d'accueil, hors ligne, mises à jour, parcours d'installation. Il est écrit pour être copié tel quel dans un autre projet ou importé dans Notion. La section 12 donne une version autonome, sans dépendance, à reprendre dans n'importe quel projet Next.js (App Router).

---

## Sommaire

1. Ça sert à quoi
2. Ce qui rend un site installable, plateforme par plateforme
3. Carte des fichiers
4. Le manifeste
5. Les icônes
6. Le service worker : ce qui est mis en cache, et ce qui ne l'est jamais
7. Mises à jour : cycle de vie du service worker
8. Le parcours d'installation (UX)
9. Hors ligne
10. Tester
11. Mise en production : checklist
12. Réutiliser dans un autre projet (code autonome)
13. Dépannage
14. Limites et évolutions possibles

---

## 1. Ça sert à quoi

Une PWA (Progressive Web App) est un site qui peut s'installer comme une application, sans passer par l'App Store ni le Play Store :

- **une icône sur l'écran d'accueil** (téléphone) ou dans le lanceur d'applications (ordinateur) ;
- **ouverture plein écran**, sans barre d'adresse, comme une app native ;
- **chargement plus rapide** aux visites suivantes : les fichiers statiques sont servis depuis le téléphone ;
- **une page propre hors ligne** au lieu de l'erreur du navigateur ;
- **mises à jour instantanées** : on déploie le site, et l'app installée est à jour. Pas de validation par un store.

Pour une boutique, l'intérêt principal est le retour de la cliente. L'icône sur l'écran d'accueil remplace un favori qu'elle ne retrouverait jamais.

C'est le même site et le même code : la PWA ajoute trois pièces au site existant.

| Pièce | Rôle |
|---|---|
| **Manifeste** (`/manifest.webmanifest`) | Nom, icônes, couleurs, mode d'affichage : ce qui rend le site installable |
| **Service worker** (`/sw.js`) | Script d'arrière-plan qui intercepte les requêtes : cache et page hors ligne |
| **Interface d'installation** | Le bandeau « Installer », le guide iOS, l'avis de nouvelle version |

---

## 2. Ce qui rend un site installable, plateforme par plateforme

**Prérequis communs :**

- **HTTPS**. `http://localhost` est la seule exception, pour le développement.
- Un manifeste avec `name` ou `short_name`, des icônes 192×192 et 512×512, `start_url` et `display: "standalone"`.

| Plateforme | Comment la cliente installe | Peut-on afficher notre propre bouton « Installer » ? |
|---|---|---|
| Chrome / Edge / Samsung Internet sur **Android** | Notre bandeau, ou menu ⋮ → « Installer l'application » | **Oui** : événement `beforeinstallprompt`, puis `prompt()` |
| Chrome / Edge sur **ordinateur** | Notre bandeau, ou l'icône d'installation dans la barre d'adresse | **Oui** : `beforeinstallprompt` |
| Safari sur **iPhone / iPad** (et Chrome, Edge iOS depuis iOS 16.4) | Bouton **Partager** → « Sur l'écran d'accueil » → « Ajouter » | **Non**, aucune API : on affiche un guide pas à pas |
| Safari sur **macOS** (Sonoma et plus) | Fichier → « Ajouter au Dock » | Non |
| Firefox Android | Menu → « Installer » | Non |
| Firefox ordinateur | Installation non prise en charge (le site reste utilisable normalement) | Non |

Conséquence pour l'interface : deux parcours, **invite native** quand le navigateur la fournit, **guide illustré** sur iOS. C'est ce que fait le bandeau (section 8).

---

## 3. Carte des fichiers

| Fichier | Rôle |
|---|---|
| `apps/web/src/app/manifest.ts` | Manifeste, servi sur `/manifest.webmanifest` ; Next ajoute la balise `<link rel="manifest">` |
| `apps/web/src/app/layout.tsx` | Métadonnées iOS (`appleWebApp`), `viewport.themeColor`, montage de `<PwaProvider />` |
| `apps/web/src/app/apple-icon.png` | Icône iOS 180×180 ; Next ajoute `<link rel="apple-touch-icon">` |
| `apps/web/public/icons/` | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `apps/web/scripts/pwa-icons.sh` | Génère toutes les icônes depuis un pictogramme |
| `apps/web/public/sw.js` | Service worker (JavaScript pur, sans dépendance) |
| `apps/web/public/offline.html` | Page hors ligne autonome |
| `apps/web/next.config.ts` | En-têtes HTTP de `/sw.js` (pas de cache, CSP) |
| `apps/web/src/features/pwa/stores/use-pwa-store.ts` | État partagé : invite d'installation, plateforme, mise à jour en attente |
| `apps/web/src/features/pwa/components/pwa-provider.tsx` | Enregistre le service worker, capte les événements, monte les bandeaux |
| `apps/web/src/features/pwa/components/install-banner.tsx` | Bandeau d'installation et guide iOS |
| `apps/web/src/features/pwa/components/install-app-button.tsx` | Bouton « Installer l'application » du pied de page |
| `apps/web/src/features/pwa/components/update-banner.tsx` | « Nouvelle version disponible » |
| `apps/web/src/features/pwa/components/offline-banner.tsx` | Bandeau « Vous êtes hors ligne » |
| `apps/web/translations/{fr,en}.json` | Textes, espace de noms `Pwa` |

Aucune dépendance n'a été ajoutée : Next.js gère nativement le manifeste et les icônes, le service worker est écrit à la main, et l'état utilise zustand et framer-motion, déjà présents.

---

## 4. Le manifeste

`src/app/manifest.ts` (convention de fichier de Next.js, aucune configuration nécessaire) :

| Champ | Valeur | Pourquoi |
|---|---|---|
| `id` | `"/"` | Identité **stable** de l'app. Sans `id`, changer `start_url` plus tard ferait de l'app une « nouvelle » application chez les clientes qui l'ont déjà installée |
| `name` / `short_name` | `Prettyfull` | Nom affiché sous l'icône (`short_name` : 12 caractères maximum conseillés) |
| `start_url` | `/?source=pwa` | Page d'ouverture. Le paramètre distingue les visites depuis l'app dans les statistiques |
| `scope` | `/` | Pages qui restent « dans l'app » ; un lien hors du scope s'ouvre dans le navigateur |
| `display` | `standalone` | Plein écran, sans barre d'adresse, mais avec la barre d'état du téléphone |
| `background_color` | `#ffffff` | Fond de l'écran de lancement (Android) |
| `theme_color` | `#ffffff` | Couleur de la barre d'état et de la barre de titre (ordinateur). Elle doit égaler le haut du site pour que la barre se fonde dans la page |
| `icons` | 192, 512 et 512 *maskable* | Voir section 5 |
| `shortcuts` | Produits, Panier, Mes commandes | Appui long sur l'icône (Android, Windows, macOS) |
| `lang`, `dir`, `categories` | `fr`, `ltr`, shopping… | Métadonnées pour le système et les magasins d'apps |

iOS lit aussi des balises dédiées, générées par Next à partir de `metadata` dans `layout.tsx` :

```ts
export const metadata: Metadata = {
  applicationName: "Prettyfull",
  appleWebApp: { capable: true, title: "Prettyfull", statusBarStyle: "default" },
  formatDetection: { telephone: false },   // pas de numéros transformés en liens bleus
};

export const viewport: Viewport = { themeColor: "#ffffff" };
```

> Avec Next.js 15 et plus, `themeColor` se déclare dans `viewport`, plus dans `metadata`.

---

## 5. Les icônes

| Fichier | Taille | Usage |
|---|---|---|
| `public/icons/icon-192.png` | 192×192 | Écran d'accueil Android, raccourcis |
| `public/icons/icon-512.png` | 512×512 | Écran de lancement, magasins, ordinateur |
| `public/icons/icon-maskable-512.png` | 512×512 | Android découpe l'icône dans la forme du téléphone (cercle, carré arrondi…) |
| `src/app/apple-icon.png` | 180×180 | iPhone / iPad |

**Icône « maskable ».** Android peut rogner l'icône jusqu'à un cercle dont le diamètre fait 80 % du côté. Le pictogramme doit tenir dans cette zone sûre, d'où un pictogramme plus petit (50 % du côté) que dans l'icône `any` (60 %). On peut vérifier le rendu sur <https://maskable.app>.

**Icône Apple.** Fond opaque obligatoire (iOS met du noir derrière la transparence) ; iOS arrondit les coins lui-même.

**Régénérer les icônes**, par exemple avec un nouveau logo (carré, 1024×1024 conseillé) :

```bash
cd apps/web
./scripts/pwa-icons.sh                 # depuis src/app/icon.svg
./scripts/pwa-icons.sh mon-logo.png    # depuis un autre fichier (SVG ou PNG)
```

Il faut `rsvg-convert` (librsvg) et `magick` (ImageMagick 7). Un SVG est recoloré en blanc sur le fond `#141311` ; un PNG est posé tel quel sur ce fond.

> Les téléphones gardent l'ancienne icône en cache : après un changement, il faut parfois désinstaller puis réinstaller l'app pour voir la nouvelle.

---

## 6. Le service worker : ce qui est mis en cache, et ce qui ne l'est jamais

`public/sw.js` est un script que le navigateur exécute **à côté** du site, même onglet fermé. Il voit passer chaque requête du site et décide d'où vient la réponse : réseau, cache, ou page hors ligne.

### 6.1 Stratégies

| Requêtes | Stratégie | Pourquoi |
|---|---|---|
| Pages (navigations) | **Réseau uniquement**, avec `offline.html` en secours | Une page en cache pourrait montrer un prix périmé, un stock faux ou les données d'une autre session. Jamais de HTML en cache |
| `/_next/static/*` (JS, CSS) | **Cache d'abord** | Fichiers hachés par Next : à une URL donnée, le contenu ne change jamais |
| Images (`/_next/image`, `/assets`, `/products`…) et polices | **Cache puis rafraîchissement** (*stale-while-revalidate*), 150 entrées maximum | Affichage immédiat, mise à jour en arrière-plan, taille du cache bornée |
| `/api/*`, `/checkout`, `/account`, `/order-confirmation`, `/login`, `/create-account` | **Jamais touchées** | Paiement, données personnelles, sessions |
| Requêtes RSC de Next (en-tête `RSC`, paramètre `_rsc`) | **Jamais touchées** | Données de navigation client, propres à chaque rendu |
| Autres origines (API backend `:7777`, Stripe, Cloudflare R2…) | **Jamais touchées** | Le service worker ne traite que l'origine du site |
| Tout ce qui n'est pas `GET` | **Jamais touché** | Envois de formulaires, mutations |

### 6.2 Précache

À l'installation, le service worker télécharge `offline.html` et deux icônes. C'est le strict minimum pour afficher une page hors ligne correcte sans réseau.

### 6.3 En-têtes HTTP

Déclarés dans `next.config.ts` :

```ts
async headers() {
  return [{
    source: "/sw.js",
    headers: [
      { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
    ],
  }];
},
```

`no-cache` est indispensable. Sinon, un CDN ou le navigateur pourrait resservir l'ancien `sw.js` pendant des heures, et aucune mise à jour ne passerait.

---

## 7. Mises à jour : cycle de vie du service worker

```
Déploiement (VERSION = "v2")
  → le navigateur détecte un sw.js différent (au chargement ou au retour sur l'app)
  → il installe la v2, qui attend (« waiting ») : la v1 continue de servir la page ouverte
  → le site affiche « Une nouvelle version est disponible. [Mettre à jour] »
  → clic : message SKIP_WAITING → la v2 prend la main → la page se recharge
  → la v2 supprime les caches pf-*-v1
```

Points clés :

- **Changer `VERSION` dans `sw.js`** à chaque modification de ce fichier. Les caches portent la version dans leur nom (`pf-static-v2`…), ce qui permet de nettoyer les anciens.
- **Les modifications du site lui-même** (pages, composants) n'exigent **pas** de changer `VERSION` : les pages ne sont jamais en cache, et les nouveaux fichiers `/_next/static` ont de nouvelles URL.
- **La mise à jour n'est jamais imposée** : remplacer le code sous une page ouverte pourrait casser un formulaire en cours de saisie.
- **`updateViaCache: "none"`** à l'enregistrement : le navigateur ne consulte jamais son cache HTTP pour `sw.js`.
- Une app installée peut rester ouverte des jours. Le provider relance donc `registration.update()` à **chaque retour au premier plan** (`visibilitychange`).
- **Le rechargement ne se fait que sur demande.** L'événement `controllerchange` se déclenche aussi à la toute première installation (`clients.claim()`) ; recharger à ce moment ferait clignoter la première visite.
- **En développement**, aucun service worker n'est enregistré, et un éventuel reste d'un `next start` est désinscrit. Sinon les modifications seraient masquées par le cache.

---

## 8. Le parcours d'installation (UX)

### 8.1 Le bandeau

Une carte en bas de l'écran (pleine largeur sur mobile, coin bas-droit sur ordinateur) : icône de l'app, « Installez Prettyfull », une phrase de bénéfice, deux boutons.

| Règle | Raison |
|---|---|
| Apparaît après **15 s** de visite | Laisser la cliente découvrir le site avant de lui demander quelque chose |
| **Jamais** sur `/checkout`, `/order-confirmation`, `/login`, `/create-account` | Ne pas distraire pendant le paiement ou la connexion |
| « Plus tard » (ou Échap) → silence pendant **14 jours** | Mémorisé dans `localStorage` (`pf-pwa-install-dismissed-until`) |
| Masqué si l'app est déjà installée ou ouverte depuis l'icône | Détection `display-mode: standalone` (et `navigator.standalone` sur iOS) |
| Non bloquant | Pas de fond grisé, le site reste utilisable |

### 8.2 Deux comportements selon le navigateur

- **Chrome, Edge, Samsung (invite native)**. Le provider intercepte `beforeinstallprompt` et le garde : l'événement n'arrive qu'une fois par chargement. « Installer » appelle `prompt()`, puis le système affiche sa propre fenêtre de confirmation. Un refus vaut « Plus tard ».
- **iPhone / iPad**. « Comment faire ? » déplie trois étapes illustrées :
  1. Touchez **Partager**, avec l'icône de Safari ;
  2. choisissez **Sur l'écran d'accueil** ;
  3. touchez **Ajouter**.

  iPadOS se présente comme un Mac : il est reconnu à son écran tactile (`MacIntel` + `maxTouchPoints > 1`).

### 8.3 Accès permanent

Le pied de page affiche un bouton **« Installer l'application »** tant que l'installation est possible et que l'app n'est pas installée. Il ignore le « Plus tard » du bandeau : la cliente peut toujours installer quand elle le décide. Sur iOS, il ouvre directement le guide, et le focus clavier passe dessus.

### 8.4 Accessibilité

- Bandeau `role="dialog"` relié à son titre (`aria-labelledby`).
- Échap ferme le bandeau.
- Cibles tactiles d'au moins 44 px de haut.
- Animation remplacée par un simple fondu si `prefers-reduced-motion` est activé.
- Bandeaux d'état (`role="status"`) annoncés par les lecteurs d'écran.
- Marge basse respectant la zone sûre des iPhone (`env(safe-area-inset-bottom)`).

---

## 9. Hors ligne

- **Navigation sans réseau** : `offline.html`, une page autonome (styles et pictogramme intégrés, aucun fichier externe), en français avec une ligne en anglais. Elle a un bouton « Réessayer » et **se recharge seule** au retour du réseau (événement `online`).
- **Réseau coupé pendant la visite** : un bandeau en haut, « Vous êtes hors ligne. Votre panier est conservé. » Le panier vit dans le navigateur (zustand persisté) et ne se perd pas.
- **Ce qui ne marche pas hors ligne**, volontairement : catalogue, compte, paiement. Tout cela dépend de données fraîches.

---

## 10. Tester

### 10.1 Sur ordinateur (Chrome ou Edge)

Le service worker n'est actif qu'en production : `pnpm dev` ne suffit pas.

```bash
cd apps/web
pnpm build && pnpm start          # http://localhost:3000
```

Puis :

1. DevTools → **Application → Manifest** : aucune erreur ; aperçu des icônes, dont la *maskable*.
2. **Application → Service workers** : `sw.js` en état *activated and is running*.
3. L'icône d'installation apparaît dans la barre d'adresse. Installer : l'app s'ouvre dans sa propre fenêtre, sans bandeau d'installation.
4. **Application → Cache storage** : `pf-precache-v1`, `pf-static-v1`, `pf-media-v1`.
5. **Network → Offline**, puis cliquer un lien : `offline.html` s'affiche. Repasser en ligne : rechargement automatique.
6. Onglet **Network** : les requêtes de `/checkout` et vers l'API (`:7777`) ne portent **pas** la mention *(ServiceWorker)*.
7. **Mise à jour** : passer `VERSION` à `"v2"` dans `public/sw.js` (`next start` sert `public/` à chaud), revenir sur l'onglet. Le bandeau « Nouvelle version » apparaît ; le clic recharge et les caches deviennent `pf-*-v2`. Remettre ensuite `"v1"`.
8. Tester le bandeau sans attendre que Chrome juge le site « installable » : *Application → Manifest → Installability*, ou simuler l'événement dans la console :

   ```js
   const e = new Event("beforeinstallprompt");
   e.prompt = async () => {};
   e.userChoice = Promise.resolve({ outcome: "dismissed" });
   window.dispatchEvent(e);
   ```

9. Remettre le bandeau à zéro après un « Plus tard » :
   `localStorage.removeItem("pf-pwa-install-dismissed-until")`.

### 10.2 Sur un vrai téléphone (HTTPS obligatoire)

Un téléphone n'accède pas à `localhost` : il faut une URL HTTPS publique. Deux options :

- un **déploiement de préproduction** (Vercel ou autre) ;
- un **tunnel** vers la machine locale :

  ```bash
  cloudflared tunnel --url http://localhost:3000    # ou : ngrok http 3000
  ```

  Ouvrir l'URL `https://…` affichée sur le téléphone.

Scénarios :

- **Android / Chrome** : après 15 s, le bandeau s'affiche ; « Installer » ouvre la fenêtre système. L'icône apparaît sur l'écran d'accueil et l'app s'ouvre plein écran. Un appui long sur l'icône affiche les raccourcis.
- **iPhone / Safari** : « Comment faire ? », puis suivre les 3 étapes. L'app s'ouvre plein écran, avec une icône nette sur fond noir.
- **Débogage à distance** : Android via `chrome://inspect` (câble USB) ; iPhone via Safari macOS → Développement.

---

## 11. Mise en production : checklist

- [ ] Site servi en **HTTPS** sur le domaine définitif.
- [ ] `https://<domaine>/manifest.webmanifest` répond avec un JSON valide.
- [ ] `https://<domaine>/sw.js` répond avec `Cache-Control: no-cache…`. Si un CDN est devant (Cloudflare…), le **contourner pour `/sw.js`** ou respecter l'en-tête d'origine.
- [ ] `/offline.html` et `/icons/*` en 200. Le Dockerfile copie déjà `apps/web/public` dans l'image.
- [ ] `theme_color` / `viewport.themeColor` identiques à la couleur du haut du site.
- [ ] Icônes définitives (logo carré) régénérées avec `scripts/pwa-icons.sh`.
- [ ] Test d'installation réel : un Android et un iPhone.
- [ ] Statistiques : suivre `?source=pwa` pour mesurer l'usage de l'app installée.
- [ ] À chaque modification de `sw.js` : incrémenter `VERSION`.

**Changer de domaine** : une PWA installée est liée à son origine. Après un changement de domaine, les clientes doivent réinstaller l'app depuis le nouveau domaine. Une redirection de l'ancien domaine ne suffit pas.

**Retirer la PWA en urgence** (service worker défectueux) : remplacer `public/sw.js` par un worker qui se désinscrit, puis déployer.

```js
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", async () => {
  for (const key of await caches.keys()) await caches.delete(key);
  await self.registration.unregister();
  for (const client of await self.clients.matchAll()) client.navigate(client.url);
});
```

Ne **jamais** supprimer simplement `sw.js` : les navigateurs gardent l'ancien worker installé tant qu'ils n'en reçoivent pas un nouveau.

---

## 12. Réutiliser dans un autre projet (code autonome)

Pour Next.js 15+ (App Router), sans dépendance. Pour un autre framework (Vite, Remix…), le manifeste devient un fichier `public/manifest.webmanifest` avec une balise `<link rel="manifest">`, et le reste est identique.

### 12.1 Étapes, dans l'ordre

1. Créer les icônes (`public/icons/…`, `app/apple-icon.png`) : copier `scripts/pwa-icons.sh` et adapter `BACKGROUND`.
2. Ajouter `app/manifest.ts` (12.2).
3. Compléter `metadata` et `viewport` dans `app/layout.tsx` (section 4).
4. Copier `public/sw.js` et adapter `BYPASS_PREFIXES` et `MEDIA_PREFIXES` aux routes du projet (12.3).
5. Copier `public/offline.html` et adapter textes et couleurs.
6. Ajouter les en-têtes de `/sw.js` dans `next.config.ts` (section 6.3).
7. Ajouter le provider (12.4) et le monter dans `app/layout.tsx`.
8. Ajouter un bandeau d'installation (12.5) et, idéalement, un bouton permanent.
9. Tester (section 10).

### 12.2 `app/manifest.ts`

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Mon App",
    short_name: "MonApp",
    description: "Description courte.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

### 12.3 `public/sw.js` (version minimale)

```js
const VERSION = "v1";
const PRECACHE = `app-precache-${VERSION}`;
const STATIC_CACHE = `app-static-${VERSION}`;
const MEDIA_CACHE = `app-media-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const BYPASS = ["/api/", "/_next/webpack-hmr", "/checkout", "/account", "/login"];
const MEDIA = ["/_next/image", "/images/", "/icons/", "/fonts/"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PRECACHE).then((c) => c.addAll([OFFLINE_URL])));
});

self.addEventListener("activate", (event) => {
  const keep = [PRECACHE, STATIC_CACHE, MEDIA_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("app-") && !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (BYPASS.some((p) => url.pathname.startsWith(p))) return;
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) ?? Response.error()));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request).then(async (res) => {
      if (res.ok) await (await caches.open(STATIC_CACHE)).put(request, res.clone());
      return res;
    })));
  } else if (MEDIA.some((p) => url.pathname.startsWith(p))) {
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const hit = await cache.match(request);
      const refresh = fetch(request).then(async (res) => {
        if (res.ok) await cache.put(request, res.clone());
        return res;
      }).catch(() => hit ?? Response.error());
      if (hit) { event.waitUntil(refresh); return hit; }
      return refresh;
    })());
  }
});
```

La version du projet (`apps/web/public/sw.js`) ajoute un plafond de 150 entrées au cache média.

### 12.4 Provider (enregistrement, installation, mises à jour)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

type InstallEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function usePwa() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  // Recharger seulement sur demande : `clients.claim()` déclenche aussi
  // `controllerchange` à la toute première installation.
  const updating = useRef(false);

  useEffect(() => {
    setStandalone(
      matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEvent(e as InstallEvent); };
    const onInstalled = () => { setInstallEvent(null); setStandalone(true); };
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);

    let registration: ServiceWorkerRegistration | undefined;
    const onControllerChange = () => { if (updating.current) location.reload(); };
    const onVisible = () => { if (document.visibilityState === "visible") registration?.update(); };

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      document.addEventListener("visibilitychange", onVisible);
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then((reg) => {
        registration = reg;
        const offer = (w: ServiceWorker) => { if (navigator.serviceWorker.controller) setWaiting(w); };
        if (reg.waiting) offer(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const w = reg.installing;
          w?.addEventListener("statechange", () => { if (w.state === "installed") offer(w); });
        });
      });
    }

    return () => {
      removeEventListener("beforeinstallprompt", onPrompt);
      removeEventListener("appinstalled", onInstalled);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return {
    canInstall: !standalone && (installEvent !== null || ios),
    nativePrompt: installEvent !== null,
    isIOS: ios,
    install: async () => {
      if (!installEvent) return false;
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      setInstallEvent(null);
      return outcome === "accepted";
    },
    updateReady: waiting !== null,
    applyUpdate: () => {
      if (!waiting) return;
      updating.current = true;
      waiting.postMessage({ type: "SKIP_WAITING" });
    },
  };
}
```

> **Un seul endroit doit écouter `beforeinstallprompt`**, monté dès le layout racine : l'événement part une fois, tôt. Si plusieurs composants ont besoin de l'état (bandeau et bouton du footer), partagez-le via un store. Ce projet utilise zustand (`use-pwa-store.ts`) ; un Context React convient aussi.

### 12.5 Bandeau minimal

```tsx
"use client";
import { useEffect, useState } from "react";
import { usePwa } from "./use-pwa";

const KEY = "install-dismissed-until";

export function InstallBanner() {
  const { canInstall, nativePrompt, isIOS, install } = usePwa();
  const [hidden, setHidden] = useState(true);
  const [steps, setSteps] = useState(false);

  useEffect(() => {
    const dismissed = Number(localStorage.getItem(KEY) ?? 0) > Date.now();
    const t = setTimeout(() => setHidden(dismissed), 15_000);
    return () => clearTimeout(t);
  }, []);

  if (!canInstall || hidden) return null;

  const later = () => {
    localStorage.setItem(KEY, String(Date.now() + 14 * 86_400_000));
    setHidden(true);
  };

  return (
    <div role="dialog" aria-labelledby="install-title" className="fixed inset-x-4 bottom-4 rounded-2xl bg-white p-5 shadow-xl">
      <p id="install-title"><strong>Installez l'application</strong></p>
      {steps && isIOS && (
        <ol>
          <li>Touchez Partager dans la barre du navigateur.</li>
          <li>Choisissez « Sur l'écran d'accueil ».</li>
          <li>Touchez « Ajouter ».</li>
        </ol>
      )}
      <button onClick={later}>Plus tard</button>
      {nativePrompt
        ? <button onClick={async () => { if (!(await install())) later(); }}>Installer</button>
        : !steps && <button onClick={() => setSteps(true)}>Comment faire ?</button>}
    </div>
  );
}
```

---

## 13. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Pas d'icône d'installation dans Chrome | HTTP au lieu de HTTPS, manifeste invalide, icône 192/512 manquante | DevTools → Application → Manifest → lire « Installability » |
| Le bandeau n'apparaît jamais sur Android | Déjà installée, « Plus tard » cliqué (14 j), page « silencieuse », ou Chrome n'a pas encore émis `beforeinstallprompt` | Vider `pf-pwa-install-dismissed-until` ; tester sur `/` ; attendre 15 s |
| Les modifications du site n'apparaissent pas en local | Un service worker d'un `next start` traîne | Il est désinscrit automatiquement en dev ; sinon DevTools → Application → Service workers → *Unregister* |
| L'app installée garde une ancienne version | `sw.js` mis en cache par un CDN, ou `VERSION` inchangée | Vérifier `Cache-Control` de `/sw.js` en production ; incrémenter `VERSION` |
| Icône rognée ou trop petite sur Android | Pictogramme hors de la zone sûre de l'icône maskable | Régénérer ; vérifier sur maskable.app |
| Icône à fond noir ou floue sur iPhone | Transparence ou mauvaise taille de l'`apple-icon` | PNG 180×180 opaque (le script le génère ainsi) |
| L'app iOS s'ouvre avec la barre Safari | Lien sortant du `scope`, ou ajout fait depuis une ancienne version d'iOS | Garder les liens internes relatifs ; réinstaller |
| Cookies ou connexion perdus dans l'app iOS | iOS isole le stockage de l'app installée de celui de Safari | Normal : la cliente se reconnecte une fois dans l'app |
| `offline.html` s'affiche alors que le réseau est là | Le serveur est réellement injoignable (erreur réseau, pas une 500) | Vérifier le serveur ; une 500 est renvoyée telle quelle |

---

## 14. Limites et évolutions possibles

- **Notifications push** (suivi de commande, promotions). Elles demandent des clés VAPID, une table d'abonnements côté backend, un envoi (`web-push`) et un gestionnaire `push` dans `sw.js`. Sur iOS, elles ne marchent que dans l'app installée (iOS 16.4+). Voir le guide officiel : `node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md`.
- **Pages consultables hors ligne** (produits déjà vus). Possible en mettant en cache les pages publiques du catalogue (*network-first*), en excluant toute page personnalisée, avec une durée de vie courte pour éviter les prix périmés.
- **Captures d'écran dans le manifeste** (`screenshots`). Android et Chrome ordinateur affichent alors une fenêtre d'installation enrichie, façon store.
- **Manifeste multilingue**. Le manifeste est en français, langue par défaut. next-intl fonctionne ici par cookie, sans préfixe d'URL : un manifeste par langue demanderait des URL distinctes.
- **Badge d'icône** (`navigator.setAppBadge`), pour afficher par exemple le nombre d'articles du panier sur l'icône. Disponible sur ordinateur et Android, avec un support partiel sur iOS.
