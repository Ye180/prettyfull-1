# Déploiement sur Dokploy (Dockerfile)

4 services dans un même projet Dokploy : **PostgreSQL**, **backend**, **web**, **admin**. Chaque application se construit depuis un Dockerfile du dépôt, avec le **contexte à la racine** (les paquets partagés `contracts`, `ui`… sont dans le monorepo).

| Service | Dockerfile | Port | Domaine |
|---|---|---|---|
| backend | `apps/backend/Dockerfile` | 7777 | `api.prettyfull.shop` |
| web | `apps/web/Dockerfile` | 3000 | `www.prettyfull.shop` |
| admin | `apps/admin/Dockerfile` | 3001 | `admin.prettyfull.shop` |

## Pour chaque application (onglet General)
- Provider : Git (ou GitHub), branche voulue.
- Build Type : **Dockerfile**. Docker Context Path : **`.`**. Dockerfile Path : `apps/<app>/Dockerfile`.
- Onglet **Domains** : ajouter le domaine, port de l'application, HTTPS (Let's Encrypt) activé.

## Variables

**backend** (onglet Environment, variables d'exécution) : voir `apps/backend/.env.example`. Indispensables :
`NODE_ENV=production`, `DATABASE_URL` (adresse *Internal Connection* de la base, sans `sslmode`), `JWT_SECRET`, `CREDENTIALS_ENCRYPTION_KEY`, `TRUST_PROXY_HOPS=1`, `CORS_ORIGINS`, `PUBLIC_API_URL`, `STOREFRONT_URL`, `ADMIN_URL`, `COOKIE_DOMAIN`, `COOKIE_SECURE=true`, `R2_*`, `STRIPE_*`.
Les migrations s'exécutent au démarrage ; `RUN_MIGRATIONS=false` les désactive.

**web et admin** : `NEXT_PUBLIC_*` sont lues **à la compilation**. Les déclarer en **Build-time Arguments** (pas en variables d'exécution) :

```
NEXT_PUBLIC_API_URL=https://api.prettyfull.shop
NEXT_PUBLIC_STOREFRONT_URL=https://www.prettyfull.shop
NEXT_PUBLIC_MEDIA_URL=https://cdn.prettyfull.shop
```

Changer l'une d'elles demande de **reconstruire** (Deploy), pas seulement de redémarrer.

## Ordre
1. Créer la base PostgreSQL (aucun port externe), noter son adresse interne.
2. Déployer le **backend** : il crée le schéma au démarrage. Vérifier `https://api…/health`.
3. Déployer **web** puis **admin**.
4. Ajouter les domaines de production dans `CORS_ORIGINS` (backend) et dans la règle CORS du bucket R2.
5. Créer un vrai compte administrateur (jamais le compte de démonstration).

## Ce qui a été vérifié
Les trois images n'ont pas pu être construites avec Docker lui-même sur la machine de développement. Chaque étape a été rejouée à la main : installation filtrée, build, `pnpm deploy` du backend (démarrage en production avec migrations, `/health` OK, `/docs` masqué), et les deux builds `standalone` (pages, manifeste, service worker, en-têtes, URL compilées). Premier déploiement : surveiller les logs de build.
