Blueprint : Architecture E-commerce Experte avec NestJS & MongoDB
Ce document sert de guide architectural complet pour la conception et la construction d'une plateforme e-commerce moderne, évolutive et performante en utilisant NestJS et MongoDB.

1. Architecture Générale (Approche "Monolithe Modulaire")
   Pour ce projet, l'approche la plus pragmatique et évolutive est le Monolithe Modulaire.

Justification :

Simplicité de Démarrage : Contrairement aux microservices, un monolithe est plus simple à développer, à déployer et à maintenir au début du projet. Cela permet une mise sur le marché plus rapide.

Performance : Les communications inter-modules se font par des appels de fonction directs en mémoire, ce qui est beaucoup plus rapide que les appels réseau (HTTP/RPC) des microservices.

Évolutivité Intrinsèque : L'architecture modulaire impose une séparation claire des préoccupations (SoC). Chaque fonctionnalité métier (produits, commandes, utilisateurs) est isolée dans son propre module NestJS. Si, à l'avenir, un module spécifique (ex: OrdersModule) devient un goulot d'étranglement, sa forte cohésion et son faible couplage faciliteront son extraction en un microservice dédié sans avoir à réécrire toute l'application.

Structure des Dossiers et Modules
Voici une structure de dossiers claire et évolutive pour votre application NestJS.

src/
├── app.module.ts
├── main.ts
|
├── modules/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ ├── auth.service.ts
│ │ ├── strategies/ # Stratégies Passport (jwt, local)
│ │ ├── guards/ # Guards (JwtAuthGuard, RolesGuard)
│ │ └── dto/ # DTOs pour login, register
│ │
│ ├── users/
│ │ ├── users.controller.ts
│ │ ├── users.module.ts
│ │ ├── users.service.ts
│ │ ├── schemas/user.schema.ts
│ │ └── dto/
│ │
│ ├── products/
│ │ ├── products.controller.ts
│ │ ├── products.module.ts
│ │ ├── products.service.ts
│ │ ├── schemas/product.schema.ts
│ │ └── dto/
│ │
│ ├── categories/
│ │ ├── categories.controller.ts
│ │ ├── ...
│ │ └── schemas/category.schema.ts
│ │
│ ├── orders/
│ │ ├── orders.controller.ts
│ │ ├── ...
│ │ └── schemas/order.schema.ts
│ │
│ ├── carts/
│ │ ├── ...
│ │ └── schemas/cart.schema.ts
│ │
│ └── notifications/
│ ├── notifications.module.ts
│ ├── notifications.processor.ts # Consumer BullMQ
│ └── notifications.producer.service.ts # Producer BullMQ
|
└── shared/
├── config/ # Gestion de la configuration (env variables)
├── database/ # Connexion Mongoose
├── decorators/ # Décorateurs personnalisés
├── filters/ # Filtres d'exception globaux
├── interfaces/ # Interfaces TypeScript partagées
└── pipes/ # Pipes de validation globaux

Responsabilités des Modules :

AuthModule: Gère l'inscription, la connexion (stratégies local), la validation des tokens JWT (stratégie jwt), et la gestion des rôles.

UsersModule: CRUD pour les utilisateurs, gestion des profils, Addresses, etc.

ProductsModule: Logique métier liée aux produits : CRUD, gestion des stocks, recherche, filtrage.

CategoriesModule: Gestion des catégories et sous-catégories hiérarchiques.

CartsModule: Gestion des paniers. Ajout, suppression d'articles, calcul du total.

OrdersModule: Workflow de commande, de la création à la validation du paiement et au suivi.

NotificationsModule: Gère l'envoi de notifications (emails, etc.) de manière asynchrone via une file d'attente.

2. Modélisation de la Base de Données (MongoDB)
   Le choix entre embedding (incorporation) et referencing (référencement) est crucial.

Embedding : Idéal pour les données qui sont lues ensemble et qui ont une relation "contient" (one-to-few). Ex: les articles d'une commande.

Referencing : Indispensable quand la même donnée est accédée par plusieurs entités ou pour des relations "many" (one-to-many, many-to-many). Ex: l'utilisateur d'une commande.

Schémas de Données (Syntaxe Mongoose)
users.schema.ts
import { Schema } from 'mongoose';

export const UserSchema = new Schema({
email: { type: String, required: true, unique: true, index: true },
password: { type: String, required: true, select: false }, // Ne jamais retourner le hash par défaut
firstName: { type: String, required: true },
lastName: { type: String, required: true },
roles: [{ type: String, enum: ['client', 'admin'], default: 'client' }],
addresses: [
{
street: String,
city: String,
zipCode: String,
country: String,
isDefault: { type: Boolean, default: false },
},
],
refreshToken: { type: String, select: false },
}, { timestamps: true });

Justification : addresses sont incorporées car elles sont spécifiques à un utilisateur et rarement lues en dehors du contexte de cet utilisateur.

products.schema.ts
import { Schema, Types } from 'mongoose';

// Structure pour le contenu multilingue
const I18nStringSchema = new Schema({
fr: { type: String, required: true },
en: { type: String, required: true },
}, { \_id: false });

// Structure pour les prix multidevises
const PriceSchema = new Schema({
amount: { type: Number, required: true }, // Stocké dans la devise de base (ex: XOF)
currency: { type: String, required: true, default: 'XOF' },
}, { \_id: false });

export const ProductSchema = new Schema({
name: I18nStringSchema,
description: I18nStringSchema,
sku: { type: String, required: true, unique: true, index: true }, // Stock Keeping Unit
prices: { // On pourrait avoir plusieurs prix (promo, etc.)
default: PriceSchema,
sale: PriceSchema,
},
categories: [{ type: Types.ObjectId, ref: 'Category', index: true }],
stock: {
quantity: { type: Number, default: 0 },
status: { type: String, enum: ['in_stock', 'out_of_stock', 'low_stock'], default: 'out_of_stock' }
},
attributes: [
{
name: I18nStringSchema,
value: I18nStringSchema,
}
],
images: [{ src: String, alt: I18nStringSchema }],
isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

Justification : Référencement pour categories car une catégorie peut contenir de nombreux produits. L'incorporation du contenu multilingue et des prix simplifie les requêtes de lecture.

categories.schema.ts
import { Schema, Types } from 'mongoose';

const I18nStringSchema = new Schema({
fr: { type: String, required: true },
en: { type: String, required: true },
}, { \_id: false });

export const CategorySchema = new Schema({
name: I18nStringSchema,
slug: { type: String, required: true, unique: true },
parent: { type: Types.ObjectId, ref: 'Category', default: null }, // Pour les sous-catégories
ancestors: [{ type: Types.ObjectId, ref: 'Category' }], // Dénormalisation pour requêtes hiérarchiques
}, { timestamps: true });

Justification : Le champ ancestors (Materialized Path pattern) est une dénormalisation qui permet de récupérer toute l'arborescence d'une catégorie en une seule requête, ce qui est extrêmement performant.

carts.schema.ts
import { Schema, Types } from 'mongoose';

export const CartSchema = new Schema({
userId: { type: Types.ObjectId, ref: 'User', unique: true, required: true, index: true },
items: [
{
productId: { type: Types.ObjectId, ref: 'Product', required: true },
quantity: { type: Number, required: true, min: 1 },
// Dénormalisation du prix pour éviter les lookups
priceAtAddition: {
amount: Number,
currency: String,
},
}
],
total: { // Calculé à la volée ou mis à jour à chaque modification
amount: Number,
currency: String,
}
}, { timestamps: true });

Justification : Un panier par utilisateur. Dénormalisation du prix pour figer le prix au moment de l'ajout au panier.

orders.schema.ts
import { Schema, Types } from 'mongoose';

const OrderItemSchema = new Schema({
productId: { type: Types.ObjectId, ref: 'Product' },
name: String, // Dénormalisation
sku: String, // Dénormalisation
quantity: { type: Number, required: true },
price: { // Prix unitaire au moment de la commande
amount: Number,
currency: String
},
}, { \_id: false });

export const OrderSchema = new Schema({
orderId: { type: String, required: true, unique: true, index: true }, // ID lisible pour le client
userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
items: [OrderItemSchema],
totalAmount: { type: Number, required: true },
currency: { type: String, required: true },
status: {
type: String,
enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
default: 'pending'
},
shippingAddress: { /_ ... _/ },
paymentDetails: {
method: String,
transactionId: String,
status: String,
}
}, { timestamps: true });

Justification : Les items sont incorporés et dénormalisés. Une commande est un document "snapshot" qui ne doit pas changer même si le produit (nom, prix) est modifié plus tard.

Anti-Patterns MongoDB à Éviter
Tableaux à Croissance Infinie (Unbounded Arrays) : Ne jamais stocker des données comme les "événements de tracking" ou les "avis clients" dans un tableau à l'intérieur d'un document Product ou Order. Cela peut faire dépasser la limite de 16 Mo par document. Solution : Créer une collection dédiée (Reviews, Events) avec une référence au document parent.

Mauvaise Indexation : Ne pas indexer les champs sur lesquels vous effectuez des recherches, des tris ou des agrégations est la cause n°1 des mauvaises performances. Solution : Analysez vos requêtes et ajoutez des index composites si nécessaire ({ "categories": 1, "isActive": 1, "prices.default.amount": 1 }).

Opérations sur de Grands Documents : Mettre à jour un petit champ dans un très gros document peut être coûteux en performance. Solution : Séparez les données "chaudes" (souvent mises à jour, ex: stock) des données "froides" (rarement modifiées, ex: description) dans des collections différentes si nécessaire (pattern "Document Versioning" ou "Subset").

3. Implémentation du Multilingue et Multidevise
   Stratégie Multilingue
   L'approche choisie est l'incorporation de champs par langue (name: { fr: '...', en: '...' }).

Avantages :

Performance en Lecture : Toutes les traductions sont récupérées en une seule requête. Pas de $lookup (jointure) nécessaire.

Simplicité : Le modèle reste simple à comprendre et à requêter. db.products.find({ "name.fr": "Mon produit" }).

Atomicité : La mise à jour du produit et de ses traductions est une opération atomique.

Inconvénients :

Ajout d'une Langue : Nécessite de mettre à jour tous les documents pour ajouter le nouveau champ de langue (peut se faire avec un script de migration).

Indexation : Si vous avez besoin de rechercher dans toutes les langues, vous devez créer un index pour chaque champ de langue ("name.fr", "name.en").

Stratégie Multidevise
Stockage : Stockez tous les prix dans une devise de base unique (ex: XOF). Cela simplifie les calculs, les agrégations et les rapports. Le schéma PriceSchema reflète cela.

Conversion :

Créez un service CurrencyService dans NestJS.

Ce service sera responsable de récupérer les taux de change. Pour la performance, ces taux ne doivent PAS être appelés en temps réel à chaque requête.

Solution : Mettez en cache les taux de change (via un CacheModule et Redis) avec une durée de vie de plusieurs heures. Un CronJob (via NestJS Schedule) peut être configuré pour rafraîchir ces taux périodiquement depuis une API fiable (ex: Open Exchange Rates).

Affichage :

L'API peut accepter un header Accept-Currency: USD ou un query param ?currency=USD.

Un intercepteur NestJS peut lire cette valeur et attacher la devise demandée à l'objet request.

Lors de la sérialisation de la réponse (ex: un DTO de produit), le CurrencyService est appelé pour convertir le prix de base dans la devise demandée avant de l'envoyer au client.

4. Authentification et Autorisation
   Système JWT (Access & Refresh Tokens)
   Login :

L'utilisateur envoie email + password.

Le serveur valide les identifiants.

Si valides, il génère deux tokens :

accessToken (durée de vie courte : 15-30 min) : Contient le userId et les roles. Utilisé pour authentifier chaque requête API.

refreshToken (durée de vie longue : 7-30 jours) : Opaque et stocké en base de données (hashé) dans le document User. Utilisé uniquement pour obtenir un nouvel accessToken.

Requêtes Authentifiées :

Le client envoie l' accessToken dans le header Authorization: Bearer <token>.

Un JwtAuthGuard sur les routes protégées valide le token (signature, expiration).

Expiration de l'Access Token :

Quand l' accessToken expire, l'API renvoie une erreur 401 Unauthorized.

Le client intercepte cette erreur et fait une requête vers une route dédiée /auth/refresh en envoyant son refreshToken.

Le serveur valide le refreshToken (contre celui stocké en BDD), et s'il est valide, retourne un nouveau couple accessToken/refreshToken.

Contrôle d'Accès Basé sur les Rôles (RBAC)
Implémentez un RolesGuard flexible.

// shared/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private reflector: Reflector) {}

canActivate(context: ExecutionContext): boolean {
const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
context.getHandler(),
context.getClass(),
]);
if (!requiredRoles) {
return true; // Si aucun rôle n'est requis, on autorise
}
const { user } = context.switchToHttp().getRequest();
// user est attaché par le JwtAuthGuard
return requiredRoles.some((role) => user.roles?.includes(role));
}
}

// Utilisation dans un contrôleur
// products.controller.ts
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
createProduct(@Body() createProductDto: CreateProductDto) {
// Seuls les admins peuvent accéder ici
}

5. Stratégie de Cache pour la Performance
   Utiliser Redis est la meilleure option pour un cache externe, persistant et partageable.

Configuration : Utilisez le CacheModule de NestJS avec cache-manager-redis-store.

Quoi Mettre en Cache ?

Données en Lecture Intensive :

La liste des produits pour la page d'accueil.

Les détails d'un produit (GET /products/:id).

L'arbre de catégories.

Les taux de change.

Clés de Cache : Utilisez des clés descriptives et uniques. Ex: product:123, categories:tree:fr, products:featured:fr:usd.

Où Mettre en Cache ?

Utilisez un Intercepteur de Cache (CacheInterceptor de NestJS) pour automatiser la mise en cache des routes GET.

Pour une logique plus complexe, injectez CacheManager (@Inject(CACHE_MANAGER)) directement dans vos services.

Invalidation du Cache : C'est la partie la plus difficile.

Stratégie : Lorsqu'une donnée est modifiée (création, mise à jour, suppression), le cache correspondant doit être invalidé.

Exemple : Dans ProductsService, après avoir mis à jour un produit...

async update(id: string, updateDto: UpdateProductDto) {
const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateDto, { new: true });

    // Invalider le cache pour ce produit spécifique
    await this.cacheManager.del(`product:${id}`);

    // Potentiellement invalider des listes qui contenaient ce produit
    // (ex: page d'accueil, résultats de recherche, etc.)
    // C'est ici que la logique peut devenir complexe.
    // Une approche peut être d'utiliser des tags de cache.

    return updatedProduct;

}

6. Gestion des Commandes et du Panier
   Workflow Logique
   Ajout au Panier : L'utilisateur ajoute un produit à son panier (POST /cart/items). Le serveur vérifie la disponibilité du stock.

Checkout : L'utilisateur initie le processus de paiement (POST /orders).

Création de Commande (Transaction Logique) : C'est une étape critique qui doit être atomique.
a. Verrouillage/Réservation du Stock : Vérifier que la quantité demandée pour chaque article est disponible. Pour éviter les "race conditions" (deux clients commandent le dernier article en même temps), utilisez une opération atomique de MongoDB :

// Dans le service Products
// Décrémente le stock seulement si la quantité est suffisante
const result = await this.productModel.updateOne(
{ \_id: productId, "stock.quantity": { $gte: quantityToDecrement } },
{ $inc: { "stock.quantity": -quantityToDecrement } }
);
// si result.modifiedCount === 0, l'opération a échoué (stock insuffisant)

b. Appel au Fournisseur de Paiement : Intégrez une API de paiement (Stripe, Paystack, etc.).
c. Si Paiement Réussi :
i. Créez le document Order dans la base de données avec le statut paid.
ii. Videz le panier de l'utilisateur.
iii. Envoyez une notification de confirmation de commande (via le système de queue).
d. Si Paiement Échoué :
i. Annulez la réservation de stock (en ré-incrémentant la quantité).
ii. Retournez une erreur au client.

7. Notifications Découplées
   L'utilisation d'une file d'attente (Queue) comme BullMQ est essentielle pour ne pas bloquer la requête HTTP de l'utilisateur pendant l'envoi d'un email, qui peut être lent.

Installation : npm install @nestjs/bullmq bullmq.

Architecture :

NotificationsProducer.service.ts : Un service qui ajoute des "jobs" à la queue. Il est appelé par d'autres services (ex: OrdersService).

Notifications.processor.ts : Un "worker" qui écoute la queue et traite les jobs un par un (ex: appeler un service d'envoi d'email comme SendGrid).

Exemple : Confirmation de Commande

// orders.service.ts
import { NotificationsProducerService } from '../notifications/notifications.producer.service';

// ... dans la méthode de création de commande, après la sauvegarde
await this.notificationsProducerService.sendOrderConfirmation(user, order);

// notifications/notifications.producer.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsProducerService {
constructor(@InjectQueue('notifications') private notificationsQueue: Queue) {}

async sendOrderConfirmation(user: User, order: Order) {
await this.notificationsQueue.add('send-email', {
template: 'order-confirmation',
to: user.email,
data: {
orderId: order.orderId,
total: order.totalAmount,
// ...
}
});
}
}

// notifications/notifications.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
// import { MailerService } from '...'; // Votre service d'email

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
constructor(/_private readonly mailerService: MailerService_/) {
super();
}

async process(job: Job<any, any, string>): Promise<any> {
if (job.name === 'send-email') {
const { template, to, data } = job.data;
// Logique pour envoyer l'email
// await this.mailerService.send({ template, to, context: data });
console.log(`Sending email to ${to} with template ${template}`);
}
}
}

8. Bonnes Pratiques et Fonctionnalités Avancées
   Validation des Données : Utilisez class-validator et class-transformer dans vos DTOs. Appliquez un ValidationPipe globalement dans main.ts.

// main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

Gestion des Erreurs Centralisée : Créez un HttpExceptionFilter global pour normaliser toutes les réponses d'erreur de l'API dans un format JSON cohérent.

Pagination, Tri et Filtrage :

Créez un DTO commun QueryDto pour gérer page, limit, sortBy, sortOrder, et des filtres dynamiques.

Ex: GET /products?limit=20&page=2&sortBy=price&sortOrder=asc&category=electronics

Le service construira dynamiquement la requête MongoDB à partir de ce DTO.

Logging : Utilisez une librairie comme Pino (via nestjs-pino) pour un logging structuré (JSON). C'est beaucoup plus facile à parser pour des outils de monitoring (Datadog, ELK).

Sécurité :

Helmet : Utilisez le middleware helmet pour ajouter des headers de sécurité importants (CSP, HSTS, etc.). app.use(helmet());

CORS : Configurez CORS pour n'autoriser que les domaines de votre front-end. app.enableCors({ origin: 'https://mon-front.com' });

Injection NoSQL : En utilisant Mongoose (ou un autre ODM), vous êtes déjà bien protégé car il "sanitize" les inputs. Évitez de construire des requêtes en concaténant des chaînes de caractères.

XSS : C'est principalement une préoccupation front-end. L'API doit cependant s'assurer de valider et nettoyer les données entrantes (ex: class-sanitizer) pour ne pas stocker de scripts malveillants.

CSRF : Moins un problème pour les API RESTful modernes utilisant des tokens JWT dans les headers, car les navigateurs n'attachent pas automatiquement le header Authorization comme ils le font pour les cookies.
