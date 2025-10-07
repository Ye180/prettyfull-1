# Étape 1 : Configuration Initiale du Projet Backend

## Objectif
Configuration de base du projet NestJS pour l'API e-commerce avec les middlewares de sécurité, la validation globale et l'infrastructure de développement.

## Dépendances Ajoutées

### Authentification & Sécurité
- `@nestjs/jwt` - Gestion des tokens JWT
- `@nestjs/passport` - Intégration Passport.js
- `passport`, `passport-local`, `passport-jwt` - Stratégies d'authentification
- `bcryptjs` - Hachage des mots de passe
- `helmet` - Sécurité HTTP headers
- `@nestjs/throttler` - Protection contre le rate limiting

### Base de Données & Cache
- `@nestjs/mongoose` - Intégration MongoDB via Mongoose
- `mongoose` - ODM MongoDB
- `@nestjs/cache-manager` - Gestion du cache
- `cache-manager` - Cache abstraction
- `ioredis` - Client Redis performant

### Files d'Attente & Jobs Asynchrones
- `@nestjs/bull` - Gestion des files d'attente
- `bull` - Processeur de jobs Redis-based

### Validation & Transformation
- `class-validator` - Validation déclarative
- `class-transformer` - Transformation d'objets
- `compression` - Compression gzip des réponses

## Configuration de l'Environnement

### Fichier `.env.example`
Variables d'environnement essentielles configurées :
- Base de données MongoDB
- Configuration Redis
- Secrets JWT (Access & Refresh tokens)
- Configuration CORS
- Rate limiting
- Taux de change des devises

### Docker Configuration
`docker-compose.yml` incluant :
- **MongoDB 7.0** avec authentification
- **Redis 7.2** pour le cache et les sessions
- **Redis Commander** interface d'administration Redis
- Initialisation automatique de la base avec des index optimisés

## Point d'Entrée (`main.ts`)

### Middlewares de Sécurité
- **Helmet** : Protection des headers HTTP
- **Compression** : Compression gzip automatique
- **CORS** : Configuration fine avec headers d'internationalisation

### Validation Globale
- `ValidationPipe` configuré pour :
  - Filtrage des propriétés non autorisées (`whitelist`)
  - Rejet des propriétés inconnues (`forbidNonWhitelisted`)
  - Transformation automatique des types
  - Conversion implicite des types

### Headers d'Internationalisation
Headers personnalisés supportés :
- `Accept-Language` : Langue demandée (fr/en)
- `Accept-Currency` : Devise demandée (XOF/USD)

## Structure des Répertoires Créée

```
apps/backend/
├── docker-compose.yml           # Infrastructure locale
├── .env.example                 # Template configuration
├── docker-init/
│   └── mongo-init.js           # Script d'initialisation MongoDB
└── src/
    └── main.ts                 # Point d'entrée configuré
```

## Prochaines Étapes

1. **Configuration du module racine** (`app.module.ts`)
2. **Génération des modules métier** via NestJS CLI
3. **Configuration du module Redis partagé**
4. **Implémentation des schémas de données avec stratégie i18n**

## Commandes de Démarrage

```bash
# Démarrer l'infrastructure
docker-compose up -d

# Copier et configurer l'environnement
cp .env.example .env

# Démarrer le serveur en mode développement
pnpm dev
```

L'API sera accessible sur `http://localhost:3001` avec la documentation Swagger sur `/api/v1/docs`.
