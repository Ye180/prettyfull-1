import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import {
  OrderConfirmationProcessor,
  NewOrderAdminProcessor,
  OrderShipmentProcessor,
} from './notifications.processor';
import { NotificationsProducerService } from './notifications.producer.service';
import { EmailService } from './services/email.service';
import { TemplateService } from './services/template.service';
import { NotificationQueue } from './types/notification.types';

/**
 * ============================================================================
 * NOTIFICATIONS MODULE - BullMQ Integration
 * ============================================================================
 *
 * Architecture:
 * - Producer: Enqueue notification jobs
 * - Processor: Consume jobs and send emails
 * - EmailService: Nodemailer integration
 * - TemplateService: Handlebars template rendering
 *
 * Queues:
 * - order-confirmation-client: Email confirmation de commande au client
 * - new-order-admin: Notification admin pour nouvelle commande
 * - order-shipment-code: Code de suivi envoyé au client
 * ============================================================================
 */
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    BullModule.registerQueue(
      {
        name: NotificationQueue.ORDER_CONFIRMATION,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100, // Garde les 100 derniers jobs réussis
          removeOnFail: false, // Garde les jobs échoués pour debugging
        },
      },
      {
        name: NotificationQueue.NEW_ORDER_ADMIN,
        defaultJobOptions: {
          attempts: 5, // Plus de tentatives pour les notifications admin
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          removeOnComplete: 100,
          removeOnFail: false,
        },
      },
      {
        name: NotificationQueue.ORDER_SHIPMENT,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: false,
        },
      },
    ),
  ],
  providers: [
    NotificationsProducerService,
    OrderConfirmationProcessor,
    NewOrderAdminProcessor,
    OrderShipmentProcessor,
    EmailService,
    TemplateService,
  ],
  exports: [NotificationsProducerService],
})
export class NotificationsModule {}
