# 🚀 Guide d'Implémentation - PrettyFull E-Commerce v2.0

## 📋 Vue d'Ensemble

Ce guide documente l'architecture mise à jour de l'application e-commerce PrettyFull, incluant les systèmes de panier robuste, notifications asynchrones, commandes temps réel, livraison, paiement multi-pays et internationalisation.

---

## 🏗️ Architecture Globale

### Modules Implémentés

1. **Cart Module (Panier)** - Redis + MongoDB Fallback
2. **Notifications Module** - BullMQ + Email Templates
3. **Orders Module** - SSE + Workflow Avancé
4. **Delivery Module** - API pour plateforme livreurs
5. **Payment Module** - Multi-pays (Factory Pattern)
6. **i18n Enhancement** - Support multilingue renforcé

---

## 📦 Module 1: Système de Panier Robuste

### Architecture Hybride Redis + MongoDB

**Stratégie de Persistance:**

- **Redis (Primary)**: Cache rapide pour toutes les opérations en temps réel
- **MongoDB (Fallback)**: Persistance permanente et récupération en cas de panne Redis

### Flux de Données

```
Client Request
     ↓
1. Lecture depuis Redis (cache hit)
     ↓ (miss)
2. Fallback MongoDB → Populate Redis
     ↓
3. Retour au client
     ↓
4. Writes: Redis + Async MongoDB sync
```

### Corrections des Bugs

#### Bug 1: Icône panier ne se met pas à jour

**Cause**: Store Zustand non synchronisé avec le backend  
**Solution**: Implémentation de `syncCart()` automatique après chaque opération

#### Bug 2: Chargement lent

**Cause**: Queries MongoDB non optimisées  
**Solution**: Redis cache + indexes MongoDB + batch loading

#### Bug 3: Mauvais produits/prix

**Cause**: Données dénormalisées obsolètes  
**Solution**: Validation stricte + refresh automatique des prix

### API Endpoints

```typescript
GET    /carts/:userId              // Récupérer le panier (Redis → MongoDB fallback)
POST   /carts/:userId/items        // Ajouter au panier (Redis + MongoDB sync)
PATCH  /carts/:userId/items/:id    // Mettre à jour quantité
DELETE /carts/:userId/items/:id    // Supprimer un article
DELETE /carts/:userId              // Vider le panier
POST   /carts/:userId/sync         // Force sync Redis ↔ MongoDB
```

### Utilisation dans l'Application Admin

```typescript
// Surveiller les paniers abandonnés
GET /api/admin/carts/abandoned?hours=24

// Statistiques temps réel
GET /api/admin/carts/stats
```

---

## 📧 Module 2: Système de Notifications (BullMQ)

### Architecture

```
Event Trigger → BullMQ Producer → Redis Queue → BullMQ Worker → Email Service
```

### Files d'Attente (Queues)

1. **order-notifications**: Notifications commandes
2. **user-notifications**: Notifications utilisateurs
3. **admin-notifications**: Alertes admin

### Templates Email

#### 1. Order_Confirmation_Client

**Trigger**: Après création commande  
**Variables**:

- `orderNumber`, `customerName`, `items[]`, `total`, `deliveryAddress`, `trackingUrl`

#### 2. New_Order_Admin

**Trigger**: Nouvelle commande créée  
**Variables**:

- `orderNumber`, `customerName`, `totalAmount`, `paymentStatus`, `adminDashboardUrl`

#### 3. Order_Shipment_Code

**Trigger**: Commande assignée à un livreur  
**Variables**:

- `orderNumber`, `customerName`, `validationCode`, `estimatedDelivery`, `driverContact`

### Configuration BullMQ

```typescript
// apps/backend/src/shared/config/bull.config.ts
export const bullConfig = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
};
```

### Utilisation

```typescript
// Dans OrdersService
await this.notificationsService.sendOrderConfirmation({
  to: order.customer.email,
  orderNumber: order.orderNumber,
  customerName: order.customer.name,
  // ...
});
```

---

## 📊 Module 3: Commandes Temps Réel (SSE)

### Server-Sent Events (SSE)

**Endpoint Client:**

```typescript
GET /orders/:orderId/track
Accept: text/event-stream
```

**Réponse:**

```
event: status-update
data: {"status": "processing", "timestamp": "2025-11-12T10:00:00Z", "message": "Commande en préparation"}

event: status-update
data: {"status": "shipped", "timestamp": "2025-11-12T14:00:00Z", "message": "Commande expédiée"}
```

### Workflow Commande

```
1. PENDING (Créée)
   ↓ [Payment confirmed]
2. PAID (Payée)
   ↓ [Admin confirms]
3. CONFIRMED (Confirmée)
   ↓ [In preparation]
4. PROCESSING (En préparation)
   ↓ [Assigned to driver]
5. ASSIGNED (Assignée livreur)
   ↓ [Driver picked up]
6. SHIPPED (En livraison)
   ↓ [Code validated]
7. DELIVERED (Livrée)
```

### Notification Admin

Chaque nouvelle commande déclenche:

1. Email admin (via BullMQ)
2. Websocket notification (si admin connecté)
3. Badge notification dashboard

---

## 🚚 Module 4: API Système de Livraison

### Rôles

- **Admin**: Assigne les commandes aux livreurs
- **Livreur**: Consulte ses commandes, valide les livraisons
- **Client**: Reçoit le code de validation par email

### Endpoints API

#### 1. Assigner un Livreur (Admin)

```typescript
POST /api/admin/orders/:orderId/assign-driver
Authorization: Bearer <admin_token>
Body: {
  "driverId": "driver_123",
  "estimatedDelivery": "2025-11-13T15:00:00Z"
}

Response: {
  "success": true,
  "order": { ... },
  "validationCode": "ABC123",
  "emailSent": true
}
```

#### 2. Liste Commandes du Livreur

```typescript
GET /api/driver/me/orders?date=2025-11-12&status=assigned
Authorization: Bearer <driver_token>

Response: {
  "orders": [
    {
      "orderId": "order_456",
      "orderNumber": "ORD-2025-001",
      "customer": {
        "name": "John Doe",
        "phone": "+225 01 02 03 04 05",
        "address": { ... }
      },
      "items": [ ... ],
      "total": { amount: 50000, currency: "XOF" },
      "validationCode": "ABC123",
      "status": "assigned"
    }
  ]
}
```

#### 3. Valider la Livraison

```typescript
POST /api/driver/orders/:orderId/validate-delivery
Authorization: Bearer <driver_token>
Body: {
  "validationCode": "ABC123",
  "deliveryNote": "Livré en main propre",
  "signatureUrl": "https://..."  // Optionnel
}

Response: {
  "success": true,
  "order": { status: "delivered", ... },
  "completedAt": "2025-11-12T16:30:00Z"
}
```

### Code de Validation

- **Format**: 6 caractères alphanumériques (ex: `ABC123`)
- **Génération**: Unique par commande, sécurisé
- **Expiration**: 48h après assignation
- **Envoi**: Email client automatique via BullMQ

### Utilisation Admin App

```typescript
// Dans l'interface Admin
// Page: Orders > Order Details

<button onClick={() => assignDriver(orderId, selectedDriverId)}>
  Assigner au Livreur
</button>

// Sélectionner parmi la liste des livreurs disponibles
<DriverSelector
  onSelect={(driverId) => setSelectedDriverId(driverId)}
  filterByLocality={order.deliveryAddress.city}
/>
```

---

## 💳 Module 5: Paiement Multi-Pays

### Architecture (Factory Pattern)

```typescript
interface PaymentProcessor {
  processPayment(order: Order): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
}

class PaymentProcessorFactory {
  static create(country: string): PaymentProcessor {
    switch (country) {
      case "US":
        return new StripeProcessor();
      case "CI":
        return new PixelPayProcessor();
      case "FR":
        return new StripeProcessor(); // Stripe Europe
      default:
        throw new Error(`No payment processor for ${country}`);
    }
  }
}
```

### Détection du Pays

```typescript
// Depuis l'adresse de livraison (priorité 1)
const country = order.deliveryAddress.country;

// Depuis le profil utilisateur (fallback)
const country = user.profile.country;

// Depuis la devise (fallback)
const country = currencyToCountryMap[order.currency];
```

### Processeurs Disponibles

#### Stripe (US, FR, EU)

- **Currencies**: USD, EUR
- **Methods**: Credit Card, Apple Pay, Google Pay
- **Config**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

#### PixelPay (CI, Afrique de l'Ouest)

- **Currencies**: XOF, CFA
- **Methods**: Mobile Money (MTN, Moov, Orange), Wave
- **Config**: `PIXELPAY_API_KEY`, `PIXELPAY_MERCHANT_ID`

### Extensibilité

Pour ajouter un nouveau pays/processeur:

1. Créer une nouvelle classe implémentant `PaymentProcessor`
2. Ajouter le mapping dans `PaymentProcessorFactory`
3. Configurer les credentials dans `.env`
4. Tester l'intégration

```typescript
// Exemple: Ajouter PayPal pour UK
class PayPalProcessor implements PaymentProcessor {
  async processPayment(order: Order): Promise<PaymentResult> {
    // Implementation
  }
}

// Dans Factory
case 'UK': return new PayPalProcessor();
```

---

## 🌍 Module 6: Internationalisation (i18n)

### Stratégie Sans Breaking Changes

#### Schémas Produits/Contenu

**Avant (Ancien Format Supporté):**

```typescript
{
  name: "T-Shirt",
  description: "Cotton t-shirt"
}
```

**Après (Nouveau Format Recommandé):**

```typescript
{
  name: {
    en: "T-Shirt",
    fr: "T-Shirt"
  },
  description: {
    en: "Cotton t-shirt",
    fr: "T-shirt en coton"
  }
}
```

### Transformation API

```typescript
// Service Layer - Transformation automatique
transformProduct(product: any, language: 'en' | 'fr') {
  return {
    id: product._id,
    name: typeof product.name === 'string'
      ? product.name  // Ancien format
      : product.name[language] || product.name.en, // Nouveau format
    description: typeof product.description === 'string'
      ? product.description
      : product.description[language] || product.description.en,
    // ...
  };
}
```

### Headers HTTP

```typescript
// Client Request
GET /api/products
Accept-Language: fr

// API Response (transformée automatiquement en français)
{
  "name": "T-shirt en coton",
  "description": "T-shirt 100% coton..."
}
```

### Migration Progressive

1. **Phase 1** (Actuelle): Dual support ancien/nouveau format
2. **Phase 2**: Script migration données existantes
3. **Phase 3**: Dépréciation ancien format (après 6 mois)
4. **Phase 4**: Suppression support ancien format

---

## 🔄 Flux Complet: De la Commande à la Livraison

```
1. CLIENT: Ajoute produits au panier
   → Redis cache + MongoDB sync

2. CLIENT: Passe commande
   → Validation stock (atomic MongoDB)
   → Sélection processeur paiement (Factory par pays)
   → Paiement (Stripe/PixelPay/...)

3. PAYMENT SUCCESS
   → Status: PENDING → PAID
   → Email confirmation client (BullMQ)
   → Email notification admin (BullMQ)
   → SSE update client

4. ADMIN: Confirme commande
   → Status: PAID → CONFIRMED
   → SSE update client

5. ADMIN: Assigne livreur
   → Status: CONFIRMED → ASSIGNED
   → Génération code validation (ABC123)
   → Email code au client (BullMQ)
   → Notification livreur
   → SSE update client

6. LIVREUR: Consulte commandes du jour
   → GET /api/driver/me/orders
   → Voit détails + code validation

7. LIVREUR: Récupère commande
   → Status: ASSIGNED → SHIPPED
   → SSE update client

8. LIVREUR: Arrive chez client
   → Client donne code validation
   → POST /api/driver/orders/:id/validate-delivery
   → Validation code
   → Status: SHIPPED → DELIVERED
   → SSE update client
   → Email confirmation livraison (BullMQ)
```

---

## 🛠️ Modifications Application Admin

### Nouvelles Fonctionnalités à Intégrer

#### 1. Dashboard Commandes Temps Réel

```tsx
// apps/admin/src/pages/orders/dashboard.tsx
import { useSSE } from "@/hooks/use-sse";

export function OrdersDashboard() {
  const { events } = useSSE("/api/admin/orders/stream");

  return (
    <div>
      <OrdersList orders={events} />
      <RealTimeStats />
    </div>
  );
}
```

#### 2. Assignation Livreurs

```tsx
// apps/admin/src/pages/orders/[id]/assign-driver.tsx
export function AssignDriverPage() {
  const { order } = useOrder(orderId);
  const { drivers } = useDrivers({
    locality: order.deliveryAddress.city,
  });

  const handleAssign = async (driverId: string) => {
    await api.admin.assignDriver(order.id, driverId);
    toast.success("Livreur assigné ! Code envoyé au client");
  };

  return <DriverSelector drivers={drivers} onSelect={handleAssign} />;
}
```

#### 3. Monitoring Paniers Abandonnés

```tsx
// apps/admin/src/pages/analytics/abandoned-carts.tsx
export function AbandonedCartsPage() {
  const { carts } = useAbandonedCarts({ hours: 24 });

  return (
    <div>
      <CartsList carts={carts} />
      <button onClick={() => sendRecoveryEmail(cart.userId)}>
        Relancer par Email
      </button>
    </div>
  );
}
```

#### 4. Configuration Paiement Multi-Pays

```tsx
// apps/admin/src/pages/settings/payments.tsx
export function PaymentSettings() {
  return (
    <div>
      <h2>Processeurs de Paiement</h2>

      <PaymentProcessorCard
        country="US"
        processor="Stripe"
        status="active"
        config={stripeConfig}
      />

      <PaymentProcessorCard
        country="CI"
        processor="PixelPay"
        status="active"
        config={pixelPayConfig}
      />

      <button onClick={addNewProcessor}>+ Ajouter Processeur</button>
    </div>
  );
}
```

---

## 📝 Variables d'Environnement

```bash
# apps/backend/.env

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/prettyfull

# BullMQ
BULL_REDIS_HOST=localhost
BULL_REDIS_PORT=6379

# Email (pour BullMQ)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_password
EMAIL_FROM=noreply@prettyfull.com

# Stripe (US, EU)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PixelPay (CI, West Africa)
PIXELPAY_API_KEY=pk_live_...
PIXELPAY_MERCHANT_ID=merchant_...
PIXELPAY_WEBHOOK_SECRET=webhook_secret_...

# SSE Configuration
SSE_PING_INTERVAL=30000
SSE_CONNECTION_TIMEOUT=300000
```

---

## 🧪 Tests

### Tests à Effectuer

#### Module Panier

- [ ] Ajout article → Vérifier Redis + MongoDB
- [ ] Redis down → Fallback MongoDB fonctionne
- [ ] Mise à jour quantité → Sync correcte
- [ ] Suppression article → Cohérence données
- [ ] Icône header → Update temps réel

#### Module Notifications

- [ ] Nouvelle commande → Email admin reçu
- [ ] Commande payée → Email client reçu
- [ ] Livreur assigné → Email code client reçu
- [ ] Retry automatique si échec
- [ ] Queues BullMQ fonctionnent

#### Module Commandes SSE

- [ ] Connexion SSE établie
- [ ] Updates status temps réel reçus
- [ ] Reconnexion auto si déconnexion
- [ ] Multiple clients simultanés

#### Module Livraison

- [ ] Admin assigne livreur → Code généré
- [ ] Livreur voit ses commandes
- [ ] Validation code → Success/Error correct
- [ ] Code invalide → Erreur appropriée
- [ ] Code expiré → Erreur appropriée

#### Module Paiement

- [ ] Commande US → Stripe utilisé
- [ ] Commande CI → PixelPay utilisé
- [ ] Webhooks reçus correctement
- [ ] Remboursements fonctionnent
- [ ] Fallback si processeur down

---

## 🚀 Déploiement

### Checklist Pre-Production

- [ ] Tous les tests passent
- [ ] Variables d'environnement configurées (prod)
- [ ] Redis cluster setup (ha)
- [ ] MongoDB replica set configuré
- [ ] BullMQ workers démarrés
- [ ] Webhooks paiement configurés
- [ ] SSL certificates installés
- [ ] Monitoring setup (logs, metrics)
- [ ] Backup automatique configuré
- [ ] Rate limiting activé
- [ ] Email templates testés
- [ ] Documentation API à jour

### Commandes Déploiement

```bash
# Build
pnpm build

# Start Production
pnpm start:prod

# Workers BullMQ (process séparé)
node dist/workers/notifications.worker.js

# Monitoring
pm2 start ecosystem.config.js
pm2 monit
```

---

## 📚 Ressources

- **BullMQ**: https://docs.bullmq.io/
- **Redis**: https://redis.io/docs/
- **Stripe API**: https://stripe.com/docs/api
- **SSE Guide**: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **Factory Pattern**: https://refactoring.guru/design-patterns/factory-method

---

## 🆘 Support & Maintenance

### Logs Importants

```bash
# Logs Redis
redis-cli monitor

# Logs BullMQ
pm2 logs notifications-worker

# Logs Application
tail -f logs/application.log
```

### Troubleshooting Commun

**Problème**: Panier ne se charge pas  
**Solution**: Vérifier Redis connexion, fallback MongoDB activé

**Problème**: Emails non envoyés  
**Solution**: Vérifier BullMQ worker actif, credentials SMTP

**Problème**: SSE déconnecté  
**Solution**: Vérifier nginx timeout, reconnexion auto client

**Problème**: Paiement échoue  
**Solution**: Vérifier logs processeur, webhooks reçus, API keys

---

## 📞 Contact

Pour toute question technique:

- **Backend**: backend-team@prettyfull.com
- **DevOps**: devops@prettyfull.com
- **Support**: support@prettyfull.com

---

**Version**: 2.0.0  
**Dernière mise à jour**: 2025-11-12  
**Auteur**: Équipe Technique PrettyFull
