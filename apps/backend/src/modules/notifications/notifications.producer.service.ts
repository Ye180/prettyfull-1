import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bull';
import type {
  NotificationJob,
  OrderCreatedPayload,
  OrderStatusPayload,
  PasswordResetPayload,
  WelcomeEmailPayload,
} from './types/notification.types';
import { NotificationType } from './types/notification.types';

/**
 * Producer Service pour ajouter des jobs de notification dans la queue Bull
 */
@Injectable()
export class NotificationsProducerService {
  private readonly logger = new Logger(NotificationsProducerService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  /**
   * Envoyer une notification de commande créée
   */
  async sendOrderCreatedNotification(
    payload: OrderCreatedPayload,
    language = 'fr',
  ): Promise<void> {
    try {
      const job: NotificationJob = {
        type: NotificationType.ORDER_CREATED,
        payload,
        metadata: { language, priority: 1 },
      };

      await this.notificationsQueue.add(NotificationType.ORDER_CREATED, job, {
        priority: 1,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      this.logger.log(
        `Order created notification queued for order: ${payload.orderNumber}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue order created notification: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Envoyer une notification de changement de statut
   */
  async sendOrderStatusNotification(
    payload: OrderStatusPayload,
    language = 'fr',
  ): Promise<void> {
    try {
      const job: NotificationJob = {
        type: NotificationType.ORDER_CONFIRMED,
        payload,
        metadata: { language, priority: 2 },
      };

      await this.notificationsQueue.add(`order_status_${payload.status}`, job, {
        priority: 2,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      this.logger.log(
        `Order status notification queued for order: ${payload.orderNumber} (status: ${payload.status})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue order status notification: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Envoyer une notification de commande annulée
   */
  async sendOrderCancelledNotification(
    payload: OrderStatusPayload,
    language = 'fr',
  ): Promise<void> {
    try {
      const job: NotificationJob = {
        type: NotificationType.ORDER_CANCELLED,
        payload,
        metadata: { language, priority: 1 },
      };

      await this.notificationsQueue.add(NotificationType.ORDER_CANCELLED, job, {
        priority: 1,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      this.logger.log(
        `Order cancelled notification queued for order: ${payload.orderNumber}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue order cancelled notification: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Envoyer un email de bienvenue (bonus)
   */
  async sendWelcomeEmail(
    payload: WelcomeEmailPayload,
    language = 'fr',
  ): Promise<void> {
    try {
      const job: NotificationJob = {
        type: NotificationType.WELCOME_EMAIL,
        payload,
        metadata: { language, priority: 3 },
      };

      await this.notificationsQueue.add(NotificationType.WELCOME_EMAIL, job, {
        priority: 3,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      });

      this.logger.log(`Welcome email queued for user: ${payload.userEmail}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue welcome email: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe (bonus)
   */
  async sendPasswordResetEmail(
    payload: PasswordResetPayload,
    language = 'fr',
  ): Promise<void> {
    try {
      const job: NotificationJob = {
        type: NotificationType.PASSWORD_RESET,
        payload,
        metadata: { language, priority: 1 },
      };

      await this.notificationsQueue.add(NotificationType.PASSWORD_RESET, job, {
        priority: 1,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });

      this.logger.log(
        `Password reset email queued for user: ${payload.userEmail}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue password reset email: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Obtenir des statistiques de la queue (pour monitoring)
   */
  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.notificationsQueue.getWaitingCount(),
      this.notificationsQueue.getActiveCount(),
      this.notificationsQueue.getCompletedCount(),
      this.notificationsQueue.getFailedCount(),
      this.notificationsQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }
}
