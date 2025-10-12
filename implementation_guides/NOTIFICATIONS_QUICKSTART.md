# 🚀 Guide de Démarrage - Module Notifications

## Prérequis

Assurez-vous que Redis est en cours d'exécution :

```bash
# Vérifier Redis
redis-cli ping
# Devrait retourner: PONG

# Si Redis n'est pas installé (Ubuntu/Debian)
sudo apt install redis-server
sudo systemctl start redis

# macOS avec Homebrew
brew install redis
brew services start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

## Configuration

Le module utilise les variables d'environnement suivantes (déjà configurées dans `.env`) :

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Démarrage du Backend

```bash
cd apps/backend
pnpm install
pnpm run start:dev
```

## Test des Notifications

### 1. Créer une Commande (déclenche notification ORDER_CREATED)

```bash
POST http://localhost:3000/orders
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+33612345678",
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "paymentMethod": "card"
}
```

**Résultat attendu dans les logs :**
```
[OrdersService] ✅ Commande ORD-20251011-0042 créée avec succès
[NotificationsProducerService] Order created notification queued for order: ORD-20251011-0042
[NotificationsProcessor] Processing ORDER_CREATED notification (job 1)...
📧 EMAIL SIMULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: john@example.com
Subject: Commande ORD-20251011-0042 confirmée
Body:
Bonjour John,
Votre commande ORD-20251011-0042 a été confirmée !
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[NotificationsProcessor] ✅ ORDER_CREATED notification sent to john@example.com
```

### 2. Annuler une Commande (déclenche notification ORDER_CANCELLED)

```bash
DELETE http://localhost:3000/orders/507f1f77bcf86cd799439011
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "reason": "Client request"
}
```

**Résultat attendu dans les logs :**
```
[OrdersService] ✅ Commande ORD-20251011-0042 annulée avec succès
[NotificationsProducerService] Order cancelled notification queued for order: ORD-20251011-0042
[NotificationsProcessor] Processing ORDER_CANCELLED notification (job 2)...
📧 EMAIL SIMULATION
To: john@example.com
Subject: Commande ORD-20251011-0042 annulée
...
[NotificationsProcessor] ✅ ORDER_CANCELLED notification sent to john@example.com
```

## Monitoring des Queues

### Voir les statistiques Redis/Bull

```typescript
// Dans votre code NestJS
const stats = await notificationsProducerService.getQueueStats();
console.log(stats);
// {
//   waiting: 5,    // Jobs en attente
//   active: 2,     // Jobs en cours de traitement
//   completed: 142, // Jobs terminés
//   failed: 3,      // Jobs échoués
//   delayed: 0      // Jobs planifiés
// }
```

### Inspecter Redis directement

```bash
# Voir toutes les clés Bull
redis-cli keys "bull:notifications:*"

# Voir les jobs en attente
redis-cli lrange "bull:notifications:wait" 0 -1

# Voir les jobs actifs
redis-cli smembers "bull:notifications:active"

# Voir les jobs complétés
redis-cli zrange "bull:notifications:completed" 0 -1

# Voir les jobs échoués
redis-cli zrange "bull:notifications:failed" 0 -1
```

## Dashboard Bull Board (Optionnel)

Pour un monitoring visuel, installez Bull Board :

```bash
pnpm add @bull-board/api @bull-board/nestjs
```

Puis ajoutez dans `app.module.ts` :

```typescript
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    // ... autres imports
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: BullMQAdapter,
    }),
  ],
})
```

Accédez ensuite à : `http://localhost:3000/admin/queues`

## Personnalisation des Notifications

### Modifier les Templates d'Email

Éditez `notifications.processor.ts` :

```typescript
private generateOrderCreatedEmailBody(payload, language): string {
  // Votre template personnalisé ici
  return `
    <html>
      <body>
        <h1>Commande ${payload.orderNumber}</h1>
        <p>Merci pour votre achat !</p>
      </body>
    </html>
  `;
}
```

### Ajouter un Nouveau Type de Notification

1. **Ajouter le type dans `notification.types.ts`**

```typescript
export enum NotificationType {
  // ... existants
  PRODUCT_BACK_IN_STOCK = 'product_back_in_stock',
}

export interface ProductBackInStockPayload {
  productId: string;
  productName: string;
  userEmail: string;
}
```

2. **Ajouter la méthode dans le Producer**

```typescript
async sendProductBackInStockNotification(
  payload: ProductBackInStockPayload,
): Promise<void> {
  const job: NotificationJob = {
    type: NotificationType.PRODUCT_BACK_IN_STOCK,
    payload,
    metadata: { priority: 2 },
  };

  await this.notificationsQueue.add(
    NotificationType.PRODUCT_BACK_IN_STOCK,
    job,
    { priority: 2, attempts: 3 }
  );
}
```

3. **Ajouter le handler dans le Processor**

```typescript
@Process(NotificationType.PRODUCT_BACK_IN_STOCK)
async handleProductBackInStock(job: Job<NotificationJob>): Promise<void> {
  const payload = job.data.payload as ProductBackInStockPayload;
  
  await this.simulateEmailSending({
    to: payload.userEmail,
    subject: `${payload.productName} est de retour en stock !`,
    body: `Le produit que vous attendiez est de nouveau disponible.`,
  });
}
```

## Intégration avec un Service Email Réel

### Exemple avec SendGrid

```bash
pnpm add @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

private async sendRealEmail(email: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const msg = {
    to: email.to,
    from: 'noreply@prettyfull.com',
    subject: email.subject,
    html: email.body,
  };

  await sgMail.send(msg);
}
```

### Exemple avec AWS SES

```bash
pnpm add @aws-sdk/client-ses
```

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'eu-west-1' });

private async sendRealEmail(email: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const command = new SendEmailCommand({
    Source: 'noreply@prettyfull.com',
    Destination: { ToAddresses: [email.to] },
    Message: {
      Subject: { Data: email.subject },
      Body: { Html: { Data: email.body } },
    },
  });

  await sesClient.send(command);
}
```

## Troubleshooting

### Problème : Redis connection refused

```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping

# Vérifier le port
netstat -an | grep 6379

# Redémarrer Redis
sudo systemctl restart redis
```

### Problème : Les notifications ne sont pas traitées

```bash
# Vérifier que le processor est enregistré
grep -r "@Processor" apps/backend/src/

# Vérifier les logs Bull
redis-cli keys "bull:notifications:*"

# Vider la queue (attention : supprime tous les jobs)
redis-cli del "bull:notifications:wait"
redis-cli del "bull:notifications:active"
```

### Problème : Jobs bloqués en "active"

```bash
# Nettoyer les jobs actifs bloqués
redis-cli del "bull:notifications:active"
redis-cli del "bull:notifications:stalled"
```

## Performance et Scalabilité

### Limiter le Nombre de Jobs Concurrents

```typescript
@Processor('notifications', {
  concurrency: 5, // Max 5 jobs en parallèle
})
export class NotificationsProcessor {
  // ...
}
```

### Rate Limiting des Emails

```typescript
private async sendEmailWithRateLimit(email: any): Promise<void> {
  // Attendre 100ms entre chaque email
  await new Promise(resolve => setTimeout(resolve, 100));
  await this.sendRealEmail(email);
}
```

### Clustering Redis

Pour la production, utilisez Redis Cluster ou Redis Sentinel :

```typescript
BullModule.forRootAsync({
  useFactory: () => ({
    redis: {
      cluster: [
        { host: 'redis-node-1', port: 6379 },
        { host: 'redis-node-2', port: 6379 },
        { host: 'redis-node-3', port: 6379 },
      ],
    },
  }),
})
```

---

**✅ Vous êtes prêt à utiliser le système de notifications !**
