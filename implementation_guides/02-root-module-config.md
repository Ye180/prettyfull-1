# Étape 2 : Configuration du Module Racine

## Objectif
Configuration complète du module racine (`app.module.ts`) avec l'intégration de tous les modules de configuration de base et des modules métier.

## Modules de Configuration Intégrés

### ConfigModule
- Configuration globale avec `.env` file
- Cache activé pour les performances
- Accessible dans toute l'application

### MongooseModule 
- Connexion asynchrone à MongoDB
- Configuration de retry avec 3 tentatives
- URI de connexion configurable via environnement

### CacheModule (Redis)
- Cache global Redis
- TTL par défaut de 5 minutes
- Configuration Redis partagée

### BullModule (Files d'attente)
- Queues Redis pour les tâches asynchrones
- Configuration Redis partagée
- Prêt pour les notifications et jobs lourds

### ThrottlerModule (Rate Limiting)
- Protection contre le spam
- Configuration flexible via variables d'environnement
- 100 requêtes par minute par défaut

## Module Redis Partagé

### RedisModule (`src/shared/redis/`)
- Module global pour client Redis ioredis
- Configuration avec retry et lazy connect
- Logging des connexions et erreurs
- Token d'injection `REDIS_CLIENT`

### Avantages du Module Partagé
- Une seule instance Redis partagée
- Gestion centralisée des erreurs
- Configuration uniforme
- Réutilisable dans tous les modules

## Modules Métier Générés

### Structure Créée
```
src/modules/
├── auth/                 # Authentification JWT
├── users/                # Gestion des utilisateurs
├── products/             # Catalogue produits
├── categories/           # Catégories produits
├── orders/               # Commandes
├── carts/                # Paniers (Redis)
├── wishlists/            # Listes de souhaits (Redis)
├── notifications/        # Notifications asynchrones
└── site-content/         # CMS léger
```

### Modules Redis vs MongoDB
- **Redis** : carts, wishlists (données temporaires/session)
- **MongoDB** : users, products, categories, orders, site-content (données persistantes)

## Configuration d'Environnement

### Variables Ajoutées
```env
# Database
DATABASE_URL=mongodb://localhost:27017/prettyfull-ecommerce

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Docker Infrastructure
Services disponibles :
- MongoDB (port 27017)
- Redis (port 6379)
- Redis Commander (port 8081) - Interface web

## Bonnes Pratiques Appliquées

### Injection de Dépendances
- Utilisation de `useFactory` pour configuration asynchrone
- Injection propre du `ConfigService`
- Gestion des valeurs par défaut

### Architecture Modulaire
- Séparation claire des responsabilités
- Modules business indépendants
- Configuration centralisée

### Gestion d'Erreurs
- Retry automatique pour MongoDB
- Logging Redis centralisé
- Configuration robuste

## Prochaines Étapes

1. **Implémentation des schémas Mongoose** avec stratégie i18n
2. **Configuration des stratégies d'authentification**
3. **Services Redis pour carts et wishlists**
4. **Validation et DTOs avec class-validator**

## Test de Configuration

```bash
# Démarrer l'infrastructure
docker-compose up -d

# Vérifier la connexion
pnpm dev

# L'API devrait démarrer sans erreurs avec :
# ✅ MongoDB connected
# ✅ Redis connected successfully
# 🚀 E-commerce API server started at http://localhost:3001
```
