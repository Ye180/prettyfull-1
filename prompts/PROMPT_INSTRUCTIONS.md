Prompt : Implémentation d'une API E-commerce avec NestJS, MongoDB et Redis
Persona : Tu es un développeur back-end expert, spécialisé dans l'écosystème NestJS, TypeScript, MongoDB et Redis.

Objectif : Implémenter une API e-commerce complète en suivant scrupuleusement les spécifications architecturales du document "Blueprint : Architecture E-commerce Experte avec NestJS & MongoDB". Tu dois écrire un code propre, modulaire et performant, étape par étape, en portant une attention particulière à l'internationalisation. dans apps backend.
Documentation : Tu dois documenter chaque étape de l'implémentation dans des fichiers markdown clairs et concis, en expliquant les choix techniques et les meilleures pratiques suivies.

Plan : consulte le fichier prompts/BACKEND_DEVELOPMENT_PLAN.md pour le plan détaillé.
DTO_BEST_PRACTICES.md pour des conseils sur la création de DTO.

Contexte Global : Internationalisation (i18n)
L'API doit être conçue dès le départ pour être multilingue et multidevise. Voici la stratégie à adopter de manière transversale :

Langues Supportées : Français (fr) et Anglais (en).

Devises Supportées : Franc CFA (XOF - devise de base) et Dollar Américain (USD).

Stratégie de Données (La plus optimale) :

Contenu Multilingue : Les champs traduisibles (ex: name, description) doivent être stockés dans un objet incorporé directement dans le modèle. Exemple : { "name": { "fr": "Mon Produit", "en": "My Product" } }.

Prix Multidevise : Tous les prix doivent être stockés en base de données dans la devise de base unique (XOF).

Stratégie de Réponse de l'API :

L'API doit interpréter les headers Accept-Language (pour la langue) et un header personnalisé Accept-Currency (pour la devise).

Pour chaque requête GET, tu dois utiliser des projections MongoDB ($project) ou une transformation dans les services pour ne retourner que la langue demandée et le prix converti dans la devise demandée. Le client ne doit pas recevoir toutes les traductions ni faire la conversion lui-même.

Étape 1 : Initialisation et Configuration du Projet
Crée un nouveau projet NestJS : nest new nest-ecommerce-api

Installe toutes les dépendances requises.

Crée la structure de base (docker-compose.yml, .env.example).

Configure le point d'entrée (src/main.ts) avec helmet, CORS, et un ValidationPipe global.

Documentation : Crée un dossier implementation_guides/ à la racine. Ajoute un fichier 01-setup-project.md qui explique clairement cette étape de configuration initiale.

Étape 2 : Configuration du Module Racine (app.module.ts)
Importe les modules de configuration de base : ConfigModule, MongooseModule, CacheModule, BullModule.

Génère la structure de tous les modules via la CLI NestJS (auth, users, products, categories, orders, carts, wishlists, notifications, et un nouveau siteContent).

Crée un module Redis partagé (src/shared/redis/redis.module.ts) qui fournit un client ioredis global.

Documentation : Crée le fichier implementation_guides/02-root-module-config.md expliquant la configuration des modules principaux et des connexions aux bases de données.

Étape 3 : Implémentation des Schémas de Données (Mongoose)
Pour chaque schéma, applique la stratégie d'internationalisation définie plus haut.

user.schema.ts : Implémente le schéma User avec un hook pre('save') pour hasher le mot de passe.

product.schema.ts : Implémente le schéma Product avec les sous-schémas I18nString pour les champs traduisibles et Price stocké en XOF.

category.schema.ts : Implémente le schéma Category avec des noms multilingues.

order.schema.ts : Implémente le schéma Order avec le sous-schéma OrderItem incorporé.

Documentation : Crée le fichier implementation_guides/03-data-schemas.md expliquant les choix de modélisation pour chaque schéma, notamment la gestion du multilingue.

Étape 4 : Module d'Authentification (AuthModule)
Implémente un système d'authentification robuste avec JWT (Access & Refresh tokens).

UsersModule : Implémente un UsersService de base (create, findOne, etc.).

Stratégies Passport : Crée les stratégies local, jwt, et jwt-refresh.

AuthService : Implémente validateUser, login, register, refreshToken.

Guards et Décorateurs : Crée les décorateurs @Public(), @Roles() et les gardes JwtAuthGuard, RolesGuard.

Configuration du Module : Configure auth.module.ts et applique les gardes globalement.

Documentation : Crée le fichier implementation_guides/04-authentication.md qui détaille le flux d'authentification, du login au rafraîchissement du token.

Étape 5 : Modules pilotés par Redis (CartsModule et WishlistsModule)
N'utilise PAS Mongoose ici. Injecte le client Redis personnalisé (@Inject(REDIS_CLIENT)).

CartsService : Utilise des clés Redis de type Hash (HINCRBY, HGETALL, HDEL).

WishlistsService : Utilise des clés Redis de type Set (SADD, SMEMBERS, SREM).

Documentation : Crée le fichier implementation_guides/05-redis-modules.md expliquant pourquoi Redis est utilisé ici et comment les commandes Redis sont mappées aux fonctionnalités.

Étape 6 : Modules Métier (Products, Categories, Orders)
ProductsService & CategoriesService : Implémente le CRUD. La méthode findAll doit gérer la pagination, le tri et le filtrage. Les méthodes de lecture doivent implémenter la projection pour ne retourner que la langue et la devise demandées.

OrdersService :

Implémente createOrder.

Utilise l'opération atomique de MongoDB pour décrémenter le stock.

Gère les cas d'échec (rollback manuel).

Appelle NotificationsProducerService après succès.

Documentation : Crée le fichier implementation_guides/06-business-logic.md expliquant le processus de création de commande et la gestion des projections pour l'internationalisation.

Étape 7 : Gestion du Contenu du Site (CMS Léger)
Ce module permet de gérer le contenu éditorial (bannières, sections "héros", etc.).

Génère un SiteContentModule avec son contrôleur et service.

Crée un site-content.schema.ts :

key: un identifiant unique et lisible (ex: home-hero-banner).

content: un objet flexible contenant les données, avec des champs multilingues.

Exemple: { "title": { "fr": "...", "en": "..." }, "imageUrl": "...", "ctaLink": "..." }

Implémente le service et le contrôleur :

Un endpoint GET /site-content/:key (public) pour récupérer le contenu d'une section dans la bonne langue.

Des endpoints POST, PATCH, DELETE (protégés, admin uniquement) pour gérer le contenu.

Documentation : Crée le fichier implementation_guides/07-site-content.md qui explique comment ce module permet de rendre le contenu du site dynamique et multilingue.

Étape 8 : Notifications Asynchrones (NotificationsModule)
Configure la Queue BullMQ dans notifications.module.ts.

Crée NotificationsProducerService pour ajouter des jobs à la queue.

Crée NotificationsProcessor pour traiter les jobs (simuler l'envoi d'email).

Documentation : Crée le fichier implementation_guides/08-async-notifications.md expliquant l'avantage des files d'attente pour découpler les tâches longues.
