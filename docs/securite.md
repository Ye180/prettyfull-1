# Sécurité : état des lieux et mise en production

Ce document recense les protections en place sur Prettyfull (API, storefront, back-office), la configuration indispensable en production, et ce qui reste à décider. Il fait suite à l'audit complet d'octobre 2026.

---

## 1. Actions obligatoires avant la mise en ligne

À faire par l'équipe : le code ne peut pas le faire à sa place.

- [ ] **Ancienne base Medusa exposée dans l'historique git.** Le mot de passe de `postgresql://medusa:…@84.247.187.15:5432/medusa-db` figure dans d'anciens commits poussés sur GitHub. Il faut changer ce mot de passe (ou supprimer cette base) et fermer le port 5432 de ce serveur au public. Ce mot de passe ne doit jamais être réutilisé. Si le dépôt est ou devient public, réécrire l'historique (`git filter-repo`, puis `push --force`).
- [ ] **Compte de démonstration.** `db:seed` crée `admin@prettyfull.shop` et `cliente@prettyfull.shop` avec un mot de passe public (écrit dans le code et le README). Vérifiez la base de production : supprimez ces comptes ou changez leur mot de passe, puis créez de vrais comptes nominatifs.
- [ ] **Variables du backend en production** (le démarrage échoue si l'une manque ou garde sa valeur d'exemple) :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `openssl rand -hex 32`, propre à la production |
| `CREDENTIALS_ENCRYPTION_KEY` | `openssl rand -hex 32`, **sauvegardée** : la perdre rend illisibles les clés des prestataires |
| `TRUST_PROXY_HOPS` | `1` derrière Traefik / Nginx / Vercel / Render ; `0` sans proxy |
| `CORS_ORIGINS` | domaines exacts du site et du panel, sans `/` final, sans `localhost` |
| `PUBLIC_API_URL`, `STOREFRONT_URL`, `ADMIN_URL` | URL HTTPS publiques |
| `COOKIE_DOMAIN` | domaine commun, par ex. `.prettyfull.shop` (voir point suivant) |

- [ ] **Un seul domaine.** Les cookies de session sont `SameSite=Strict`. Il faut servir l'API, le site et le panel sous **le même domaine** (`api.prettyfull.shop`, `www.prettyfull.shop`, `admin.prettyfull.shop`). Sur des adresses `*.vercel.app` distinctes, le navigateur n'envoie jamais le cookie : les clientes seraient déconnectées à chaque rechargement.
- [ ] **Base de données** : jamais exposée publiquement. Accès restreint à l'API, mot de passe fort, sauvegardes automatiques activées (Neon : *point-in-time restore*).

---

## 2. Protections en place

### Authentification et sessions
- Mots de passe hachés en Argon2id. Politique : 10 caractères minimum, majuscule, minuscule et chiffre.
- Connexion sans énumération de comptes : un seul message d'erreur, et un hachage factice pour les e-mails inconnus.
- Jeton d'accès JWT de 15 min, algorithme HS256 imposé, conservé en mémoire (jamais dans `localStorage`).
- Jeton de rafraîchissement dans un cookie `httpOnly`, `Secure` et `SameSite=Strict`. Il change à chaque usage, de façon atomique : deux requêtes simultanées n'ouvrent pas deux sessions.
- **Détection de vol de session** : un ancien jeton de rafraîchissement réutilisé ferme toutes les sessions du compte.
- Comptes équipe et comptes clientes strictement séparés (`kind`). Chaque route du panel exige une permission précise.

### Limitation de débit (`apps/backend/src/middleware/rate-limit.ts`)

| Point d'entrée | Limite |
|---|---|
| Connexion (panel et boutique) | 30 / 15 min par IP **et** 10 / 15 min par e-mail |
| Renouvellement de session | 60 / 15 min par IP |
| Inscription | 10 / h par IP |
| Passage de commande | 20 / 15 min par IP |
| Reprise de paiement | 20 / 15 min par IP |
| Avis, contact | 10 / h et 5 / h par IP |
| Photos d'avis (seul téléversement anonyme) | 20 / h par IP |
| Tout `/api/store/*` et `/api/admin/*` | 600 / min par IP |

Au-delà de la limite, l'API répond `429` avec un en-tête `Retry-After`. L'IP est lue de façon infalsifiable selon `TRUST_PROXY_HOPS`.

### Paiement et commandes
- Les prix, frais de port et remises sont **toujours recalculés par le serveur**. Le tarif de livraison doit correspondre à l'adresse et au poids réels.
- Webhooks : signature HMAC vérifiée en temps constant, idempotence, montant contrôlé. La notification doit aussi viser une commande payée par **ce** prestataire.
- Le prestataire de test (qui accepte des notifications non signées) **n'existe pas en production**.
- Un paiement tardif ne ressuscite jamais une commande annulée ou remboursée.
- Les URL de retour après paiement sont fixées par le serveur, jamais fournies par le client (pas de redirection vers un site de phishing).
- Code promo : limite d'utilisation vérifiée et incrémentée en une seule requête (pas de dépassement en parallèle).
- Panier verrouillé à la validation : pas de double commande.
- Remboursements sérialisés par commande (pas de double remboursement). Remboursement partiel refusé pour Wave, qui rembourse toujours tout.
- Une cliente ne peut annuler qu'une commande non payée. Une commande payée passe par un remboursement de l'équipe.
- Les statuts « payée » et « remboursée » ne se posent que par leurs actions dédiées.
- Stock : verrous sur les réservations, si bien que le balayage et un paiement simultané ne décrémentent pas deux fois. Si un paiement arrive après l'expiration de la réservation, le stock est décrémenté à partir des lignes de commande, et un manque est signalé dans l'historique.
- Produits retirés de la vente refusés à la commande. Commandes refusées en mode maintenance.

### Données exposées
- La vue cliente d'une commande ne montre ni le journal des transactions, ni l'identité de l'équipe, ni les commentaires internes.
- La recherche publique ne renvoie que les produits publiés et non supprimés.
- Les clés des prestataires sont chiffrées en AES-256-GCM et ne sont jamais renvoyées par l'API.
- Le jeton de confirmation de commande n'apparaît pas dans les journaux d'accès.
- `/docs` et `/openapi.json` ne sont disponibles qu'hors production.

### Navigateur
- Site et panel : `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'`, HSTS 2 ans, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, pas d'en-tête `X-Powered-By`. Le panel est en plus marqué `noindex`.
- Redirection après connexion limitée au site lui-même. Les contournements `//`, `/\`, `/.//`, tabulations et URL absolues sont testés.
- Aucun `dangerouslySetInnerHTML` : contenus CMS, avis et descriptions sont affichés comme du texte.
- Facture HTML : données échappées, et CSP interne qui interdit tout script.
- Photos d'avis acceptées uniquement depuis notre bucket Cloudflare R2.
- Export CSV protégé contre l'injection de formules tableur.
- Service worker (PWA) : aucune page HTML, aucune réponse d'API ni donnée personnelle mise en cache.

### Données et infrastructure
- `db:seed` et `db:reset` refusent toute base distante, quel que soit `NODE_ENV`. Seule une autorisation explicite qui nomme l'hôte les débloque : `ALLOW_DESTRUCTIVE_DB=<hôte>`.
- Le build de production n'embarque ni les scripts de seed, ni le mot de passe de démonstration.
- `.env*` ignorés par git et exclus des images Docker. Seuls les fichiers `.env.example` sont suivis.
- `docker-compose` publie Postgres et Redis sur `127.0.0.1` uniquement.
- Dépendances : next 16.3.8, hono 4.13.13. Correctifs forcés pour kysely, react-router et qs (`pnpm.overrides`).

---

## 3. Limites connues et décisions à prendre

| Sujet | Risque | Recommandation |
|---|---|---|
| Limitation de débit en mémoire | Inefficace si l'API tourne sur plusieurs instances | Passer les compteurs dans Redis (`REDIS_URL` déjà prévu) avant de répliquer l'API |
| Pas de captcha | Création de comptes et commandes par robot, même ralentie | Cloudflare Turnstile sur l'inscription et la commande invitée |
| Inscription | Révèle si un e-mail a déjà un compte | Réponse générique + e-mail de confirmation |
| Réinitialisation de mot de passe | N'existe pas encore | À construire : jeton haché, usage unique, durée courte, réponse générique, limite de débit |
| Paiement à la livraison | Réservation de stock de 20 min, alors que l'encaissement arrive des jours plus tard | Choisir une durée de réservation métier pour ce mode, ou accepter le contrôle à l'expédition |
| Code promo | Un usage reste compté pour une commande jamais payée | Décompter à l'annulation ou à l'expiration, ou ne compter qu'au paiement |
| Session de 15 min après suspension | Un compte suspendu garde son jeton d'accès jusqu'à expiration | `tokenVersion` vérifié pour les comptes équipe |
| CSP `script-src` | Non stricte (Next demande des nonces par requête) | À ajouter si du HTML riche est un jour affiché |
| `apps/backend/dist` suivi par git | Un `node dist/index.js` pourrait lancer une version sans ces correctifs | Construire au déploiement, puis `git rm -r --cached apps/backend/dist` |
| `apps/web/Dockerfile` | Obsolète (variables Medusa) | Le supprimer en déploiement Vercel, ou le réécrire |
| `effect` (admin), `braces` (web) | Alertes d'audit restantes | Non exploitables ici (fonction serveur dans un paquet navigateur, et outil de développement) ; surveiller les mises à jour |

---

## 4. Vérifier

```bash
cd apps/backend && pnpm test          # signatures Stripe, limitation de débit
pnpm audit --prod                     # dépendances
curl -sI https://www.prettyfull.shop | grep -iE "frame|security|transport"
```

Contrôle manuel après déploiement :
- 31 tentatives de connexion → réponse `429`.
- `https://api…/docs` → `404`.
- Le site ne s'affiche pas dans une iframe.
