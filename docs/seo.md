# SEO avec Next.js (App Router) : guide complet

Ce guide décrit le référencement du storefront Prettyfull (`apps/web`) : titres, descriptions, mots-clés, partage sur les réseaux, données structurées, sitemap, robots. Il est écrit pour être copié dans un autre projet ou importé dans Notion. La section 11 donne le socle minimal à reprendre tel quel.

---

## Sommaire

1. Ce qui est en place
2. Carte des fichiers
3. Comment une page obtient ses métadonnées
4. Règles de rédaction : titres, descriptions, mots-clés
5. Données structurées (JSON-LD)
6. Sitemap et robots.txt
7. Pages exclues de Google
8. Dev et staging : jamais indexés
9. Variables d'environnement
10. Mise en ligne : checklist et Google Search Console
11. Réutiliser dans un autre projet
12. Vérifier
13. Limites connues et évolutions

---

## 1. Ce qui est en place

| Sujet | État |
|---|---|
| Titre et description par page | Oui, en français. Pages produit et collection : générés depuis le back-office |
| Champs « Méta-titre » et « Méta-description » du back-office | Utilisés en priorité sur les fiches produit. Les catégories les gèrent côté API, mais le formulaire du back-office ne les propose pas encore (section 13) |
| URL canonique | Oui, sur toutes les pages indexables |
| Open Graph et Twitter Card (aperçu WhatsApp, Facebook, X, LinkedIn) | Oui, avec l'image du produit ou l'image par défaut `public/opengraph-image.png` |
| Données structurées | `Store`, `WebSite` (toutes les pages), `Product` + fil d'Ariane (fiches), `CollectionPage` + fil d'Ariane (collections) |
| `sitemap.xml` | Dynamique : pages fixes, catégories, tous les produits publiés, avec images |
| `robots.txt` | Autorise le public, interdit panier, compte, paiement, connexion |
| Pages privées | `noindex` en en-tête HTTP |
| Dev, staging, localhost | Fermés à Google automatiquement |
| Mots-clés | Posés (`keywords`), mais voir la section 4 : Google ne les lit plus |

---

## 2. Carte des fichiers

```
apps/web/
├── public/opengraph-image.png            image de partage par défaut (1200×630)
├── next.config.ts                        en-têtes X-Robots-Tag (pages privées)
└── src/
    ├── app/
    │   ├── layout.tsx                    métadonnées globales + JSON-LD Store/WebSite
    │   ├── robots.ts                     /robots.txt
    │   ├── sitemap.ts                    /sitemap.xml
    │   ├── (home)/page.tsx               accueil (titre complet, canonical « / »)
    │   ├── (home)/(shop)/products/[handle]/page.tsx     fiche produit : generateMetadata + JSON-LD
    │   ├── (home)/(shop)/collections/[slug]/page.tsx    collection : generateMetadata + JSON-LD
    │   └── (home)/(informations)/…/page.tsx             about, faq, contact, livraison, CGV
    └── lib/seo/
        ├── site.ts                       constantes du site + buildMetadata()  ← seul fichier à adapter
        ├── api.ts                        lecture serveur de l'API (mise en cache, jamais d'exception)
        ├── schema.ts                     constructeurs Schema.org
        └── json-ld.tsx                   composant <JsonLd />
```

---

## 3. Comment une page obtient ses métadonnées

**Pages fixes** (à propos, FAQ, contact…) : un `export const metadata = buildMetadata({...})` dans `page.tsx`.

```tsx
export const metadata = buildMetadata({
  title: "Contact : une question sur une commande ?",
  description: "Une question sur un produit, un colis ou un retour ? Écrivez à l'équipe…",
  path: "/contact",
  keywords: ["contact Prettyfull"],
});
```

**Pages dynamiques** (produit, collection) : `generateMetadata` lit la donnée côté serveur (`lib/seo/api.ts`) :

1. Le **méta-titre** saisi dans le back-office, sinon le nom du produit.
2. La **méta-description** saisie, sinon la description courte, sinon un texte généré.

Pour une catégorie : le titre est `<nom> : achat en ligne à Abidjan`, la description est celle de la catégorie.
3. L'image du produit pour l'aperçu de partage.

Si l'API est injoignable ou si le produit n'existe pas, la page passe en `noindex` plutôt que de publier un titre vide. Elle ne plante pas.

**Titre final** : le layout racine ajoute ` | Prettyfull` à tous les titres (`template`). N'écrivez donc jamais « Prettyfull » dans un titre de page. Seule l'accueil utilise `title: { absolute: … }`.

**Langue** : les pages sont référencées en français (langue par défaut). La langue du visiteur se choisit par cookie, sans URL séparée, donc il n'y a pas de balises `hreflang`. Voir la section 13.

---

## 4. Règles de rédaction

### Titre (`title`)
- **50 à 60 caractères**, gabarit ` | Prettyfull` compris. Au-delà, Google coupe.
- Le mot qui compte en premier : `Collagène en poudre : peptides | Prettyfull`.
- Un titre unique par page. Jamais deux pages avec le même.

### Description (`description`)
- **120 à 155 caractères**. `buildMetadata` coupe proprement à 155 sur un mot.
- Une phrase qui donne envie de cliquer : ce que c'est, pour qui, un bénéfice (« livré à Abidjan », « authentique »).
- Pas de description copiée sur plusieurs produits.

### Mots-clés (`keywords`)
Google ignore la balise `keywords` depuis 2009. Ce qui compte, ce sont les mots **dans le contenu** : le titre, la description, les titres H1/H2, les noms de catégories, les textes alternatifs des images. La balise reste renseignée pour d'autres moteurs, mais n'y passez pas de temps.

Pour choisir les expressions à placer dans les titres et descriptions, pensez à ce que tape une cliente : produit + lieu (`vitamines Abidjan`), produit + usage (`collagène peau cheveux`), produit + origine (`produits américains`).

### Dans le back-office
Sur chaque produit (page Catalogue, bloc SEO), remplir **Méta-titre** et **Méta-description** quand le nom du produit seul ne suffit pas. Exemple : le produit s'appelle « Biotin Gummies 5000 mcg ». Méta-titre conseillé : « Biotine 5000 mcg en gummies : cheveux et ongles ». Sans méta-titre, le nom du produit est utilisé.

### Texte alternatif des images
Les images de la fiche produit et des cartes portent déjà le nom du produit en `alt`. Dans les aperçus de partage, l'`alt` est celui saisi pour l'image, sinon le nom du produit.

### Un seul H1 par page
Déjà respecté : accueil, collections, fiche produit, panier, contact et FAQ ont chacun un seul `<h1>`.

---

## 5. Données structurées (JSON-LD)

Le JSON-LD est un bloc `<script type="application/ld+json">` qui décrit la page aux moteurs de recherche. Il permet les résultats enrichis : prix et disponibilité sous le lien du produit, fil d'Ariane, fiche de la boutique.

| Page | Types |
|---|---|
| Toutes | `Store` (la boutique : nom, logo, zone Abidjan, e-mail) et `WebSite` |
| Fiche produit | `Product` avec `Offer` (prix, devise XOF, disponibilité selon le stock), `BreadcrumbList` |
| Collection | `CollectionPage`, `BreadcrumbList` |

Détails à connaître :
- Le prix est toujours déclaré en **XOF** (devise de vente), quelle que soit la devise affichée au visiteur.
- La disponibilité suit le statut de stock du back-office (`in_stock`, `low_stock`, `out_of_stock`).
- Le composant `<JsonLd />` échappe le caractère `<` : un nom de produit saisi dans le back-office ne peut pas fermer la balise `<script>`.
- Les avis clients ne sont pas déclarés (`aggregateRating`). Google l'exige seulement quand les avis sont visibles sur la page. À ajouter quand l'affichage des avis est en ligne.

Valider : <https://search.google.com/test/rich-results> (coller l'URL d'une fiche produit).

---

## 6. Sitemap et robots.txt

**`/sitemap.xml`** est généré à la demande (`force-dynamic`) :
- pages fixes (accueil, collections, à propos, FAQ, contact, livraison, CGV) ;
- chaque catégorie, avec sa date de mise à jour ;
- chaque produit publié, avec sa date de mise à jour et ses 3 premières images.

Les réponses de l'API sont mises en cache 10 minutes par Next : le sitemap ne surcharge pas le backend. Un nouveau produit apparaît donc dans le sitemap dans les 10 minutes.

Le sitemap n'est pas calculé au build, parce que l'API n'est pas forcément joignable pendant la construction de l'image Docker.

**`/robots.txt`** autorise tout sauf `/api/`, `/cart`, `/checkout`, `/account`, `/order-confirmation`, `/login`, `/create-account`, `/wishlist`, et annonce le sitemap.

---

## 7. Pages exclues de Google

Ces pages n'ont aucune valeur pour la recherche et contiennent des données personnelles. Elles reçoivent l'en-tête HTTP `X-Robots-Tag: noindex, nofollow` (voir `next.config.ts`) :

`/cart`, `/checkout`, `/account/*`, `/order-confirmation`, `/login`, `/create-account`, `/wishlist`, `/products` (page vide), `/pages/*` et `/page/*` (doublons de l'accueil).

**Pourquoi un en-tête et pas une balise `<meta>` :** plusieurs de ces pages sont des composants client (`"use client"`), qui ne peuvent pas exporter de métadonnées. L'en-tête couvre tout au même endroit.

**Ne pas combiner `Disallow` et `noindex` pour une page déjà indexée.** Si Google ne peut pas lire la page, il ne voit jamais le `noindex`. Ici, les pages privées n'ont jamais été indexées : les deux protections coexistent sans problème.

---

## 8. Dev et staging : jamais indexés

Un site de test public, indexé, concurrence la production avec le même contenu. Le code l'empêche :

`IS_INDEXABLE` vaut `false` quand l'URL du site (`NEXT_PUBLIC_STOREFRONT_URL`) commence par `localhost`, `dev.`, `staging.`, `test.` ou `preview.`. Dans ce cas :
- `robots.txt` renvoie `Disallow: /` et aucun sitemap ;
- chaque page porte `<meta name="robots" content="noindex, nofollow">`.

Pour forcer l'exclusion sur un autre domaine : `NEXT_PUBLIC_NOINDEX=true`.

Vérifier sur `dev.prettyfull.shop` : `https://dev.prettyfull.shop/robots.txt` doit afficher `Disallow: /`.

---

## 9. Variables d'environnement

Toutes sont lues **au build** : sur Dokploy, les déclarer dans « Build-time Arguments » puis redéployer (un simple redémarrage ne suffit pas).

| Variable | Rôle | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_STOREFRONT_URL` | URL publique du site, sans `/` final. Base des canoniques, du sitemap et des aperçus. Sert aussi à détecter dev/staging | Oui |
| `NEXT_PUBLIC_API_URL` | URL de l'API, pour lire les produits côté serveur | Oui |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification Google Search Console | Non |
| `NEXT_PUBLIC_NOINDEX` | `true` pour exclure un environnement de l'index | Non |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Compte X du site, ex. `@prettyfull` | Non |

Si `NEXT_PUBLIC_STOREFRONT_URL` est vide, le code retombe sur `https://www.prettyfull.shop`.

---

## 10. Mise en ligne : checklist et Google Search Console

**Avant de publier :**
- [ ] `NEXT_PUBLIC_STOREFRONT_URL=https://www.prettyfull.shop` (ou le domaine retenu) en Build-time Argument du service `web` de production.
- [ ] Un seul domaine pour le public. Rediriger `prettyfull.shop` vers `www.prettyfull.shop` (ou l'inverse) : deux adresses sans redirection créent du contenu dupliqué. Le canonique pointe sur `NEXT_PUBLIC_STOREFRONT_URL`.
- [ ] `https://www.prettyfull.shop/robots.txt` affiche `Allow: /` et la ligne `Sitemap:`.
- [ ] `https://www.prettyfull.shop/sitemap.xml` contient les produits.
- [ ] Les produits et catégories de production ont un nom clair et une image.
- [ ] Remplir Méta-titre et Méta-description sur les 10 produits les plus importants.

**Google Search Console** (gratuit, indispensable) :
1. Aller sur <https://search.google.com/search-console>, « Ajouter une propriété », type « Domaine » : `prettyfull.shop`.
2. Valider par DNS : Google donne une ligne `TXT` à ajouter dans la zone DNS du domaine (à côté des enregistrements A existants).
3. Menu « Sitemaps » : envoyer `https://www.prettyfull.shop/sitemap.xml`.
4. Menu « Inspection de l'URL » : coller la page d'accueil et une fiche produit, puis « Demander une indexation ».
5. Revenir dans une semaine : le rapport « Pages » indique ce qui est indexé et pourquoi le reste ne l'est pas.

**Google Business Profile** (hors code) : créer la fiche de la boutique pour apparaître sur Google Maps pour les recherches locales à Abidjan.

Les premiers résultats mettent quelques jours à quelques semaines. Un site neuf n'apparaît pas en première page dès le premier jour, quel que soit le travail technique.

---

## 11. Réutiliser dans un autre projet

Copier `src/lib/seo/` et `src/app/robots.ts` / `src/app/sitemap.ts`, puis :

**1. Adapter `lib/seo/site.ts`** : `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`, `SITE_LOCALE` (`fr_FR`, `en_US`…), l'adresse e-mail et la ville dans `schema.ts`.

**2. Layout racine** (`app/layout.tsx`) :

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} : ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: SITE_LOCALE, url: SITE_URL,
               images: [OG_DEFAULT_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_DEFAULT_IMAGE.url] },
  robots: IS_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};
// dans <body> : <JsonLd data={[organizationSchema(), websiteSchema()]} />
```

Ne pas mettre `alternates.canonical` dans le layout racine : toutes les pages qui n'en définissent pas hériteraient de la même URL.

**3. Une page dynamique** :

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;                 // Next 15+ : params est une Promise
  const item = await getItem(slug);              // lecture serveur, mise en cache
  if (!item) return noIndexMetadata("Introuvable");
  return buildMetadata({
    title: item.metaTitle || item.name,
    description: item.metaDescription || item.summary,
    path: `/items/${item.slug}`,
    images: [{ url: item.image, alt: item.name }],
  });
}
```

**4. Sitemap** : lister les routes fixes et celles venant de la base ou de l'API. Garder `export const dynamic = "force-dynamic"` si les données ne sont pas joignables au build.

**5. Image de partage** : un PNG 1200×630 dans `public/opengraph-image.png`. Générer avec ImageMagick :

```bash
magick -size 1200x630 xc:white \( public/logo.png -resize 880x \) -gravity center -composite public/opengraph-image.png
```

**6. Dockerfile** : déclarer chaque `NEXT_PUBLIC_*` en `ARG` puis en `ENV` avant `next build`.

**Pièges déjà rencontrés :**
- Dans Next 16, `params` est une `Promise` : il faut l'`await`.
- Un composant `"use client"` ne peut pas exporter `metadata` : utiliser un `layout.tsx` serveur voisin, ou un en-tête dans `next.config`.
- Le fichier `app/opengraph-image.png` crée une URL à empreinte, pas `/opengraph-image.png`. Mettre l'image dans `public/` pour une URL stable.
- Écrire du texte avec ImageMagick demande une police compatible : `fc-list` en renvoie parfois une qui n'affiche pas les accents.

---

## 12. Vérifier

```bash
# Titre, description, canonique, aperçu de partage d'une page
curl -s https://www.prettyfull.shop/products/<slug> | grep -oE '<title>[^<]*|<meta name="description"[^>]*|<link rel="canonical"[^>]*|<meta property="og:[a-z:]*" content="[^"]*"'

# Données structurées
curl -s https://www.prettyfull.shop/products/<slug> | grep -o 'application/ld+json">[^<]*' | head -c 800

# Pages privées
curl -sI https://www.prettyfull.shop/cart | grep -i x-robots-tag      # noindex, nofollow

# robots et sitemap
curl -s https://www.prettyfull.shop/robots.txt
curl -s https://www.prettyfull.shop/sitemap.xml | grep -c "<loc>"
```

Outils en ligne :
- Résultats enrichis : <https://search.google.com/test/rich-results>
- Aperçu de partage Facebook : <https://developers.facebook.com/tools/debug/>
- Performance et SEO : Lighthouse dans Chrome (DevTools, onglet « Lighthouse »), ou <https://pagespeed.web.dev>

Contrôle automatique après chaque déploiement de production : `robots.txt` ne doit **pas** contenir `Disallow: /` seul. Si c'est le cas, `NEXT_PUBLIC_STOREFRONT_URL` pointe vers un domaine de dev ou `NEXT_PUBLIC_NOINDEX` est resté à `true`.

---

## 13. Limites connues et évolutions

| Sujet | Détail | Suite possible |
|---|---|---|
| **Contenu rendu côté navigateur** | Les titres, descriptions, balises sociales et JSON-LD sont dans le HTML initial. Mais la liste des produits d'une collection et le texte détaillé d'une fiche sont chargés par le navigateur après coup. Google exécute le JavaScript, mais plus lentement et moins fiablement qu'avec du HTML complet | Afficher le nom, le prix et la description du produit dans le rendu serveur de la fiche, puis hydrater |
| **Une seule langue indexée** | La langue se choisit par cookie : Google ne voit que le français. Pas de `hreflang` | Passer à des URL par langue (`/fr/…`, `/en/…`) si une audience anglophone devient importante |
| **Pas de page de recherche** | Le champ de recherche du site mène à `/search`, qui n'existe pas encore. Aucune action de recherche n'est déclarée à Google pour cette raison | Créer la page, puis ajouter `potentialAction` (`SearchAction`) dans `websiteSchema` |
| **SEO des catégories** | L'API accepte `metaTitle` et `metaDescription` sur les catégories, mais le formulaire du back-office ne les affiche pas : le titre est généré à partir du nom | Ajouter les deux champs au formulaire des catégories |
| **Pas d'avis dans les données structurées** | Voir la section 5 | Ajouter `aggregateRating` quand les avis sont affichés sur la fiche |
| **Pages CMS** | Les pages statiques du back-office ne sont pas dans le sitemap : il n'y a pas de liste publique | Ajouter un endpoint de liste, puis les inclure dans `sitemap.ts` |
| **Performance** | Non mesurée dans cette passe | Lancer Lighthouse en production et traiter LCP et taille des images |
