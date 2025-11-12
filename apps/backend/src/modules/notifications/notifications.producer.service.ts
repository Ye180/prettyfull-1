import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import {
  NotificationQueue,
  NotificationJobName,
  OrderConfirmationData,
  NewOrderAdminData,
  OrderShipmentData,
} from './types/notification.types';

/**
 * ============================================================================
 * NOTIFICATIONS PRODUCER SERVICE - BullMQ
 * ============================================================================
 *
 * Service producteur pour ajouter des jobs de notification dans les queues.
 * Chaque type de notification a sa propre queue pour un meilleur contrôle.
 *
 * Usage:
 * - Injecter ce service dans les modules Orders/Products
 * - Appeler les méthodes appropriées après les événements métier
 * ============================================================================
 */
@Injectable()
export class NotificationsProducerService {
  private readonly logger = new Logger(NotificationsProducerService.name);

  constructor(
    @InjectQueue(NotificationQueue.ORDER_CONFIRMATION)
    private readonly orderConfirmationQueue: Queue,
    @InjectQueue(NotificationQueue.NEW_ORDER_ADMIN)
    private readonly newOrderAdminQueue: Queue,
    @InjectQueue(NotificationQueue.ORDER_SHIPMENT)
    private readonly orderShipmentQueue: Queue,
  ) {}

  /**
   * Mettre en file d'attente une confirmation de commande pour le client
   */
  async queueOrderConfirmation(
    data: OrderConfirmationData,
  ): Promise<Job<OrderConfirmationData>> {
    try {
      const job = await this.orderConfirmationQueue.add(
        NotificationJobName.SEND_ORDER_CONFIRMATION,
        data,
        {
          priority: 1,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      );

      this.logger.log(
        `Order confirmation notification queued: ${data.orderId} (Job ID: ${job.id})`,
      );

      return job;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue order confirmation: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Mettre en file d'attente une notification admin pour nouvelle commande
   */
  async queueNewOrderAdmin(
    data: NewOrderAdminData,
  ): Promise<Job<NewOrderAdminData>> {
    try {
      const job = await this.newOrderAdminQueue.add(
        NotificationJobName.SEND_NEW_ORDER_NOTIFICATION,
        data,
        {
          priority: 2,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      );

      this.logger.log(
        `New order admin notification queued: ${data.orderId} (Job ID: ${job.id})`,
      );

      return job;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue new order admin notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Mettre en file d'attente un email de code de livraison
   */
  async queueOrderShipment(
    data: OrderShipmentData,
  ): Promise<Job<OrderShipmentData>> {
    try {
      const job = await this.orderShipmentQueue.add(
        NotificationJobName.SEND_SHIPMENT_CODE,
        data,
        {
          priority: 1,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      );

      this.logger.log(
        `Order shipment notification queued: ${data.orderId} (Job ID: ${job.id})`,
      );

      return job;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue order shipment notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Obtenir des statistiques des queues (pour monitoring)
   */
  async getQueueStats() {
    const [orderConfirmationStats, newOrderAdminStats, orderShipmentStats] =
      await Promise.all([
        this.getQueueStatsForQueue(this.orderConfirmationQueue),
        this.getQueueStatsForQueue(this.newOrderAdminQueue),
        this.getQueueStatsForQueue(this.orderShipmentQueue),
      ]);

    return {
      orderConfirmation: orderConfirmationStats,
      newOrderAdmin: newOrderAdminStats,
      orderShipment: orderShipmentStats,
    };
  }

  /**
   * Obtenir les statistiques d'une queue spécifique
   */
  private async getQueueStatsForQueue(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
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
