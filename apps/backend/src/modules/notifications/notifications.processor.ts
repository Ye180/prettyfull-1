import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from './services/email.service';
import { TemplateService } from './services/template.service';
import {
  NewOrderAdminData,
  NotificationJobResult,
  NotificationQueue,
  OrderConfirmationData,
  OrderShipmentData,
} from './types/notification.types';

/**
 * ============================================================================
 * ORDER CONFIRMATION PROCESSOR - BullMQ Worker
 * ============================================================================
 * Traite les jobs de confirmation de commande client
 */
@Processor(NotificationQueue.ORDER_CONFIRMATION)
export class OrderConfirmationProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderConfirmationProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  async process(
    job: Job<OrderConfirmationData>,
  ): Promise<NotificationJobResult> {
    this.logger.log(
      `Processing order confirmation (Job ${job.id}, Order: ${job.data.orderId})...`,
    );

    try {
      const { customerEmail, language } = job.data;

      // Render template with customer's language
      const htmlContent = this.templateService.render(
        'order-confirmation',
        job.data,
        language,
      );

      // Send email
      const result = await this.emailService.sendEmail({
        to: customerEmail,
        subject:
          language === 'fr'
            ? 'Confirmation de votre commande'
            : 'Order Confirmation',
        html: htmlContent,
      });

      if (result.success) {
        this.logger.log(
          `✅ Order confirmation sent to ${customerEmail} (Order: ${job.data.orderId}, MessageID: ${result.messageId})`,
        );
        return {
          success: true,
          messageId: result.messageId,
          timestamp: new Date(),
        };
      } else {
        this.logger.error(
          `❌ Failed to send order confirmation to ${customerEmail}: ${result.error}`,
        );
        throw new Error(result.error);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process order confirmation job ${job.id}: ${err.message}`,
        err.stack,
      );
      throw error; // BullMQ will retry based on job options
    }
  }
}

/**
 * ============================================================================
 * NEW ORDER ADMIN PROCESSOR - BullMQ Worker
 * ============================================================================
 * Traite les notifications admin pour nouvelles commandes
 */
@Processor(NotificationQueue.NEW_ORDER_ADMIN)
export class NewOrderAdminProcessor extends WorkerHost {
  private readonly logger = new Logger(NewOrderAdminProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  async process(job: Job<NewOrderAdminData>): Promise<NotificationJobResult> {
    this.logger.log(
      `Processing new order admin notification (Job ${job.id}, Order: ${job.data.orderId})...`,
    );

    try {
      const { adminEmails, orderId } = job.data;

      // Render admin template (always in French for now)
      const htmlContent = this.templateService.render(
        'new-order-admin',
        job.data,
        'fr',
      );

      // Send to all admin emails
      const results = await Promise.allSettled(
        adminEmails.map((adminEmail) =>
          this.emailService.sendEmail({
            to: adminEmail,
            subject: `🛒 Nouvelle commande #${orderId.slice(-8)}`,
            html: htmlContent,
          }),
        ),
      );

      // Check results
      const successCount = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success,
      ).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        this.logger.log(
          `✅ New order admin notification sent to ${successCount}/${adminEmails.length} admins (Order: ${orderId})`,
        );
      }

      if (failCount > 0) {
        this.logger.warn(
          `⚠️ Failed to send to ${failCount}/${adminEmails.length} admins (Order: ${orderId})`,
        );
      }

      // Consider job successful if at least one email was sent
      if (successCount > 0) {
        return { success: true, timestamp: new Date() };
      } else {
        throw new Error('Failed to send to any admin');
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process new order admin job ${job.id}: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}

/**
 * ============================================================================
 * ORDER SHIPMENT PROCESSOR - BullMQ Worker
 * ============================================================================
 * Traite les emails de code de suivi
 */
@Processor(NotificationQueue.ORDER_SHIPMENT)
export class OrderShipmentProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderShipmentProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  async process(job: Job<OrderShipmentData>): Promise<NotificationJobResult> {
    this.logger.log(
      `Processing order shipment notification (Job ${job.id}, Order: ${job.data.orderId})...`,
    );

    try {
      const { customerEmail, language, trackingCode, orderId } = job.data;

      // Render template with customer's language
      const htmlContent = this.templateService.render(
        'order-shipment',
        job.data,
        language,
      );

      // Send email
      const result = await this.emailService.sendEmail({
        to: customerEmail,
        subject:
          language === 'fr'
            ? `📦 Votre colis est en route - Code de suivi: ${trackingCode}`
            : `📦 Your package is on the way - Tracking: ${trackingCode}`,
        html: htmlContent,
      });

      if (result.success) {
        this.logger.log(
          `✅ Shipment notification sent to ${customerEmail} (Order: ${orderId}, Tracking: ${trackingCode}, MessageID: ${result.messageId})`,
        );
        return {
          success: true,
          messageId: result.messageId,
          timestamp: new Date(),
        };
      } else {
        this.logger.error(
          `❌ Failed to send shipment notification to ${customerEmail}: ${result.error}`,
        );
        throw new Error(result.error);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process shipment notification job ${job.id}: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}
