# Module 2: Système de Notifications avec BullMQ - Complété ✅

**Date de complétion**: $(date)  
**Statut**: Production-ready avec email templates

---

## 📋 Objectif du Module

Implémenter un système de notifications robuste avec:

- Files d'attente BullMQ pour traitement asynchrone
- Envoi d'emails via SMTP (Nodemailer)
- Templates HTML avec Handlebars
- Support bilingue (français/anglais)
- Retry automatique sur échec
- Monitoring des queues

---

## 🏗️ Architecture Implémentée

### Structure des Queues

3 queues séparées pour isolation et monitoring granulaire:

```
order-confirmation-client  → Confirmations de commande client
new-order-admin            → Notifications admin nouvelles commandes
order-shipment-code        → Codes de suivi livraison
```

### Composants Créés

#### 1. **EmailService** (`services/email.service.ts`)

- **Rôle**: Envoi d'emails via Nodemailer/SMTP
- **Méthodes**:
  - `sendEmail(emailData)`: Envoi email avec gestion d'erreur
  - `verifyConnection()`: Health check SMTP
- **Configuration**: Variables d'environnement SMTP\_\*

#### 2. **TemplateService** (`services/template.service.ts`)

- **Rôle**: Rendu de templates Handlebars avec helpers personnalisés
- **Méthodes**:
  - `render(templateName, data, language)`: Rendu template bilingue
  - `registerHelpers()`: Helpers formatCurrency, formatDate, eq
  - `clearCache()`: Vider le cache de templates
- **Cache**: Map<string, HandlebarsTemplateDelegate> pour performances

#### 3. **NotificationsProducerService** (`notifications.producer.service.ts`)

- **Rôle**: Enqueue des jobs dans les queues BullMQ
- **Méthodes**:
  - `queueOrderConfirmation(data)`: Enqueue confirmation client
  - `queueNewOrderAdmin(data)`: Enqueue notification admin
  - `queueOrderShipment(data)`: Enqueue code de suivi
  - `getQueueStats()`: Statistiques de toutes les queues
- **Retour**: Job<T> pour tracking (job.id, job.progress, etc.)

#### 4. **OrderConfirmationProcessor** (`notifications.processor.ts`)

- **Rôle**: Worker BullMQ pour confirmations de commande
- **Process**:
  1. Render template avec langue client
  2. Envoi email via EmailService
  3. Log succès avec messageId SMTP
  4. Retour NotificationJobResult

#### 5. **NewOrderAdminProcessor** (`notifications.processor.ts`)

- **Rôle**: Worker BullMQ pour notifications admin
- **Process**:
  1. Render template admin (français)
  2. Envoi à tous les adminEmails en parallèle
  3. Job réussi si au moins 1 email envoyé
  4. Warn si échecs partiels

#### 6. **OrderShipmentProcessor** (`notifications.processor.ts`)

- **Rôle**: Worker BullMQ pour codes de suivi
- **Process**:
  1. Render template avec langue client
  2. Envoi email avec tracking code
  3. Log avec orderId + trackingCode
  4. Retour NotificationJobResult

---

## 📧 Email Templates Créés

### 1. **order-confirmation.fr.hbs** / **order-confirmation.en.hbs**

- Confirmation de commande client
- Détails complets: items, totaux, adresse livraison
- Design responsive avec CSS inline
- Variables: `customerName`, `items[]`, `subtotal`, `shipping`, `total`, `shippingAddress`

### 2. **new-order-admin.hbs**

- Notification admin nouvelle commande
- Grille d'infos: date, montant, articles, client
- Lien vers panneau admin
- Variables: `orderId`, `orderDate`, `totalAmount`, `itemsCount`, `customerName`, `customerEmail`, `customerPhone`, `shippingAddress`

### 3. **order-shipment.fr.hbs** / **order-shipment.en.hbs**

- Email code de suivi livraison
- Box de tracking avec code, transporteur, date estimée
- Liste articles expédiés
- Variables: `trackingCode`, `carrier`, `estimatedDelivery`, `trackingUrl`, `items[]`, `customerName`

**Features communes**:

- Responsive design (mobile-first)
- CSS inline pour compatibilité email
- Helpers Handlebars: `{{formatCurrency}}`, `{{formatDate}}`, `{{#each}}`, `{{#if}}`
- Footer avec liens réseaux sociaux (placeholders)

---

## 🔧 Configuration Requise

### Variables d'Environnement

Ajouter à `.env`:

```bash
# SMTP Configuration (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false         # true pour port 465 (SSL)
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM="PrettyFull <noreply@prettyfull.com>"

# Admin Notifications
ADMIN_EMAILS=admin1@prettyfull.com,admin2@prettyfull.com
ADMIN_URL=https://admin.prettyfull.com

# Redis (déjà configuré dans Module 1)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Providers SMTP Recommandés

- **SendGrid**: 100 emails/jour gratuit
- **Mailgun**: 5000 emails/mois gratuit
- **AWS SES**: $0.10 / 1000 emails
- **Brevo (Sendinblue)**: 300 emails/jour gratuit

---

## 📊 Types et Interfaces

### NotificationQueue (enum)

```typescript
ORDER_CONFIRMATION = "order-confirmation-client";
NEW_ORDER_ADMIN = "new-order-admin";
ORDER_SHIPMENT = "order-shipment-code";
```

### NotificationJobName (enum)

```typescript
SEND_ORDER_CONFIRMATION = "send-order-confirmation";
SEND_NEW_ORDER_NOTIFICATION = "send-new-order-notification";
SEND_SHIPMENT_CODE = "send-shipment-code";
```

### OrderConfirmationData

```typescript
{
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: { amount: number; currency: string };
    image?: string;
  }>;
  subtotal: {
    amount: number;
    currency: string;
  }
  shipping: {
    amount: number;
    currency: string;
  }
  total: {
    amount: number;
    currency: string;
  }
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }
  language: "fr" | "en";
}
```

### NewOrderAdminData

```typescript
{
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderDate: Date;
  totalAmount: { amount: number; currency: string };
  itemsCount: number;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
  adminEmails: string[];
}
```

### OrderShipmentData

```typescript
{
  orderId: string;
  customerEmail: string;
  customerName: string;
  trackingCode: string;
  carrier: string;
  estimatedDelivery?: Date;
  trackingUrl?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  language: 'fr' | 'en';
}
```

### NotificationJobResult

```typescript
{
  success: boolean;
  messageId?: string;  // SMTP message ID
  timestamp: Date;
  error?: string;
}
```

---

## 🔄 Intégration dans Orders Module

### Exemple: Créer une commande et envoyer notifications

```typescript
import { NotificationsProducerService } from "../notifications/notifications.producer.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly notificationsProducer: NotificationsProducerService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    // 1. Créer la commande
    const order = await this.ordersModel.create(createOrderDto);

    // 2. Enqueue confirmation client
    await this.notificationsProducer.queueOrderConfirmation({
      orderId: order._id.toString(),
      customerEmail: order.customer.email,
      customerName: order.customer.name,
      orderDate: order.createdAt,
      items: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.imageUrl,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      language: order.customer.language || "fr",
    });

    // 3. Enqueue notification admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    await this.notificationsProducer.queueNewOrderAdmin({
      orderId: order._id.toString(),
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      orderDate: order.createdAt,
      totalAmount: order.total,
      itemsCount: order.items.length,
      shippingAddress: order.shippingAddress,
      adminEmails,
    });

    return order;
  }

  async updateTrackingCode(
    orderId: string,
    trackingCode: string,
    carrier: string
  ) {
    const order = await this.ordersModel.findByIdAndUpdate(
      orderId,
      { trackingCode, carrier, status: "shipped" },
      { new: true }
    );

    // Enqueue shipment notification
    await this.notificationsProducer.queueOrderShipment({
      orderId: order._id.toString(),
      customerEmail: order.customer.email,
      customerName: order.customer.name,
      trackingCode,
      carrier,
      estimatedDelivery: order.estimatedDelivery,
      trackingUrl: `https://tracking.example.com/${trackingCode}`,
      items: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
      })),
      language: order.customer.language || "fr",
    });

    return order;
  }
}
```

---

## 🧪 Test du Système

### 1. Vérifier la connexion SMTP

```typescript
// Dans un controller ou script de test
import { EmailService } from "./services/email.service";

@Injectable()
export class NotificationsTestService {
  constructor(private readonly emailService: EmailService) {}

  async testConnection() {
    const isConnected = await this.emailService.verifyConnection();
    console.log("SMTP Connection:", isConnected ? "✅ OK" : "❌ Failed");
  }
}
```

### 2. Envoyer un email de test

```typescript
// Créer un endpoint de test (à retirer en production)
@Get('test/send-confirmation')
async testConfirmation() {
  const job = await this.notificationsProducer.queueOrderConfirmation({
    orderId: 'test-order-123',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    orderDate: new Date(),
    items: [
      {
        name: 'Product Test',
        quantity: 2,
        price: { amount: 29.99, currency: 'EUR' },
        image: 'https://via.placeholder.com/150',
      },
    ],
    subtotal: { amount: 59.98, currency: 'EUR' },
    shipping: { amount: 5.00, currency: 'EUR' },
    total: { amount: 64.98, currency: 'EUR' },
    shippingAddress: {
      street: '123 Test Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    language: 'fr',
  });

  return { jobId: job.id, status: 'queued' };
}
```

### 3. Monitoring des Queues

```typescript
@Get('admin/queue-stats')
async getQueueStats() {
  const stats = await this.notificationsProducer.getQueueStats();
  return stats;

  // Retourne:
  // {
  //   orderConfirmation: { waiting: 0, active: 0, completed: 15, failed: 0, delayed: 0 },
  //   newOrderAdmin: { waiting: 0, active: 0, completed: 15, failed: 0, delayed: 0 },
  //   orderShipment: { waiting: 0, active: 0, completed: 5, failed: 0, delayed: 0 }
  // }
}
```

---

## 📈 Configuration des Queues

### Options par Queue

**Order Confirmation** (client):

- Attempts: 3
- Backoff: exponential, 2000ms
- Priority: 1 (haute)

**New Order Admin**:

- Attempts: 5 (plus de retries pour admins)
- Backoff: exponential, 3000ms
- Priority: 2 (normale)

**Order Shipment**:

- Attempts: 3
- Backoff: exponential, 2000ms
- Priority: 1 (haute)

### Rétention des Jobs

- `removeOnComplete: 100` → Garde les 100 derniers jobs réussis
- `removeOnFail: false` → Garde tous les jobs échoués pour debugging

---

## 🔍 Monitoring & Debugging

### Logs Processor

Chaque processor log:

- Début processing: `Processing order confirmation (Job X, Order: Y)...`
- Succès: `✅ Order confirmation sent to email@example.com (Order: Y, MessageID: Z)`
- Échec: `❌ Failed to process order confirmation job X: Error message`

### Redis CLI

Inspecter les queues:

```bash
# Lister les clés de queues
redis-cli KEYS "bull:order-*"

# Voir les jobs en attente
redis-cli LRANGE "bull:order-confirmation-client:waiting" 0 -1

# Voir les jobs échoués
redis-cli LRANGE "bull:order-confirmation-client:failed" 0 -1

# Stats d'une queue
redis-cli HGETALL "bull:order-confirmation-client:counts"
```

### BullMQ Board (optionnel)

Installer le dashboard web pour monitoring visuel:

```bash
npm install @bull-board/api @bull-board/nestjs
```

---

## 🚀 Prochaines Étapes

### Module 3: SSE pour Tracking Temps Réel

Avec le système de notifications en place, Module 3 utilisera:

- BullMQ pour déclencher événements SSE vers admin dashboard
- Notifications en temps réel quand nouvelle commande créée
- Push updates vers clients quand statut commande change

### Améliorations Futures (Module 2)

1. **Webhooks SMTP**: Tracking ouvertures/clics emails
2. **Templates additionnels**:
   - Abandon de panier
   - Relance commande non payée
   - Demande d'avis après livraison
3. **Internationalisation étendue**: Plus de langues
4. **A/B Testing**: Tester variants de templates
5. **Rate Limiting**: Limiter emails par utilisateur/période
6. **Unsubscribe**: Gestion désabonnement marketing

---

## ✅ Checklist de Complétion

- [x] BullMQ packages installés (@nestjs/bullmq, bullmq, nodemailer, handlebars)
- [x] 3 queues séparées configurées dans module
- [x] EmailService créé avec Nodemailer
- [x] TemplateService créé avec Handlebars + helpers
- [x] 5 templates HTML créés (bilingues fr/en)
- [x] NotificationsProducerService migré vers BullMQ
- [x] 3 Processors créés (OrderConfirmation, NewOrderAdmin, OrderShipment)
- [x] Types et interfaces documentés
- [x] NotificationsModule updated avec tous les providers
- [ ] Variables d'environnement SMTP ajoutées (à faire par utilisateur)
- [ ] Test de connexion SMTP effectué
- [ ] Intégration avec Orders module (Module 3)

---

## 📝 Notes Importantes

1. **SMTP Credentials**: Ne jamais commit les credentials SMTP. Utiliser `.env` et ajouter à `.gitignore`.

2. **Rate Limiting**: En production, implémenter rate limiting pour éviter spam/abus.

3. **Unsubscribe Link**: Ajouter lien de désabonnement dans templates marketing (légal RGPD).

4. **Retry Strategy**: BullMQ retry automatiquement avec backoff exponentiel. Monitorer jobs failed.

5. **Template Cache**: TemplateService cache les templates compilés. Redémarrer app si modifications templates.

6. **Admin Emails**: Configurer ADMIN_EMAILS en liste CSV dans .env pour notifications admin.

7. **Error Handling**: Processors throwent les erreurs pour trigger retry. Jobs échoués après toutes tentatives restent dans queue "failed".

---

**Module 2 Complété! 🎉**  
**Prêt pour Module 3: SSE Real-time Tracking**
