import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import type {
  NotificationJob,
  OrderCreatedPayload,
  OrderStatusPayload,
} from './types/notification.types';
import { NotificationType } from './types/notification.types';

/**
 * Consumer BullMQ pour traiter les notifications en arrière-plan
 */
@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  /**
   * Traiter les notifications de commande créée
   */
  @Process(NotificationType.ORDER_CREATED)
  async handleOrderCreated(job: Job<NotificationJob>): Promise<void> {
    this.logger.log(`Processing ORDER_CREATED notification (job ${job.id})...`);

    try {
      const payload = job.data.payload as OrderCreatedPayload;
      const language = job.data.metadata?.language || 'fr';

      // Simulation d'envoi d'email
      await this.simulateEmailSending({
        to: payload.userEmail,
        subject:
          language === 'fr'
            ? `Commande ${payload.orderNumber} confirmée`
            : `Order ${payload.orderNumber} confirmed`,
        body: this.generateOrderCreatedEmailBody(payload, language),
      });

      this.logger.log(
        `✅ ORDER_CREATED notification sent to ${payload.userEmail} (Order: ${payload.orderNumber})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process ORDER_CREATED notification: ${err.message}`,
        err.stack,
      );
      throw error; // Re-throw pour que Bull puisse retry
    }
  }

  /**
   * Traiter les notifications de commande annulée
   */
  @Process(NotificationType.ORDER_CANCELLED)
  async handleOrderCancelled(job: Job<NotificationJob>): Promise<void> {
    this.logger.log(
      `Processing ORDER_CANCELLED notification (job ${job.id})...`,
    );

    try {
      const payload = job.data.payload as OrderStatusPayload;
      const language = job.data.metadata?.language || 'fr';

      await this.simulateEmailSending({
        to: payload.userEmail,
        subject:
          language === 'fr'
            ? `Commande ${payload.orderNumber} annulée`
            : `Order ${payload.orderNumber} cancelled`,
        body: this.generateOrderCancelledEmailBody(payload, language),
      });

      this.logger.log(
        `✅ ORDER_CANCELLED notification sent to ${payload.userEmail} (Order: ${payload.orderNumber})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process ORDER_CANCELLED notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Traiter les autres statuts de commande (confirmed, shipped, delivered)
   */
  @Process('order_status_confirmed')
  @Process('order_status_shipped')
  @Process('order_status_delivered')
  async handleOrderStatus(job: Job<NotificationJob>): Promise<void> {
    this.logger.log(`Processing ORDER_STATUS notification (job ${job.id})...`);

    try {
      const payload = job.data.payload as OrderStatusPayload;
      const language = job.data.metadata?.language || 'fr';

      await this.simulateEmailSending({
        to: payload.userEmail,
        subject:
          language === 'fr'
            ? `Commande ${payload.orderNumber} - Mise à jour`
            : `Order ${payload.orderNumber} - Update`,
        body: this.generateOrderStatusEmailBody(payload, language),
      });

      this.logger.log(
        `✅ ORDER_STATUS notification sent to ${payload.userEmail} (Order: ${payload.orderNumber}, Status: ${payload.status})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process ORDER_STATUS notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Traiter les emails de bienvenue
   */
  @Process(NotificationType.WELCOME_EMAIL)
  async handleWelcomeEmail(job: Job<NotificationJob>): Promise<void> {
    this.logger.log(`Processing WELCOME_EMAIL (job ${job.id})...`);

    try {
      const payload = job.data.payload as {
        userEmail: string;
        userName: string;
      };
      const language = job.data.metadata?.language || 'fr';

      await this.simulateEmailSending({
        to: payload.userEmail,
        subject: language === 'fr' ? 'Bienvenue !' : 'Welcome!',
        body:
          language === 'fr'
            ? `Bonjour ${payload.userName}, bienvenue sur notre plateforme !`
            : `Hello ${payload.userName}, welcome to our platform!`,
      });

      this.logger.log(`✅ WELCOME_EMAIL sent to ${payload.userEmail}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process WELCOME_EMAIL: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Traiter les emails de réinitialisation de mot de passe
   */
  @Process(NotificationType.PASSWORD_RESET)
  async handlePasswordReset(job: Job<NotificationJob>): Promise<void> {
    this.logger.log(`Processing PASSWORD_RESET (job ${job.id})...`);

    try {
      const payload = job.data.payload as {
        userEmail: string;
        resetLink: string;
      };
      const language = job.data.metadata?.language || 'fr';

      await this.simulateEmailSending({
        to: payload.userEmail,
        subject:
          language === 'fr'
            ? 'Réinitialisation de votre mot de passe'
            : 'Reset your password',
        body:
          language === 'fr'
            ? `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${payload.resetLink}`
            : `Click this link to reset your password: ${payload.resetLink}`,
      });

      this.logger.log(`✅ PASSWORD_RESET sent to ${payload.userEmail}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Failed to process PASSWORD_RESET: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Simuler l'envoi d'un email (en production, utilisez SendGrid, AWS SES, etc.)
   */
  private async simulateEmailSending(email: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    // Simuler un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.logger.debug(`
📧 EMAIL SIMULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email.to}
Subject: ${email.subject}
Body:
${email.body}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  /**
   * Générer le corps de l'email pour une commande créée
   */
  private generateOrderCreatedEmailBody(
    payload: OrderCreatedPayload,
    language: string,
  ): string {
    if (language === 'fr') {
      return `
Bonjour ${payload.userName},

Votre commande ${payload.orderNumber} a été confirmée !

Montant total: ${payload.total.amount} ${payload.total.currency}

Articles commandés:
${payload.items.map((item) => `- ${item.name} x${item.quantity} (${item.price.amount} ${item.price.currency})`).join('\n')}

Adresse de livraison:
${payload.shippingAddress.fullName}
${payload.shippingAddress.street}
${payload.shippingAddress.city}, ${payload.shippingAddress.country}

Merci pour votre commande !
      `;
    }

    return `
Hello ${payload.userName},

Your order ${payload.orderNumber} has been confirmed!

Total amount: ${payload.total.amount} ${payload.total.currency}

Ordered items:
${payload.items.map((item) => `- ${item.name} x${item.quantity} (${item.price.amount} ${item.price.currency})`).join('\n')}

Shipping address:
${payload.shippingAddress.fullName}
${payload.shippingAddress.street}
${payload.shippingAddress.city}, ${payload.shippingAddress.country}

Thank you for your order!
    `;
  }

  /**
   * Générer le corps de l'email pour une commande annulée
   */
  private generateOrderCancelledEmailBody(
    payload: OrderStatusPayload,
    language: string,
  ): string {
    if (language === 'fr') {
      return `
Bonjour,

Votre commande ${payload.orderNumber} a été annulée.

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe
      `;
    }

    return `
Hello,

Your order ${payload.orderNumber} has been cancelled.

If you have any questions, please contact us.

Best regards,
The team
    `;
  }

  /**
   * Générer le corps de l'email pour un changement de statut
   */
  private generateOrderStatusEmailBody(
    payload: OrderStatusPayload,
    language: string,
  ): string {
    if (language === 'fr') {
      return `
Bonjour,

Le statut de votre commande ${payload.orderNumber} a été mis à jour: ${payload.status}

${payload.trackingNumber ? `Numéro de suivi: ${payload.trackingNumber}` : ''}

Cordialement,
L'équipe
      `;
    }

    return `
Hello,

Your order ${payload.orderNumber} status has been updated: ${payload.status}

${payload.trackingNumber ? `Tracking number: ${payload.trackingNumber}` : ''}

Best regards,
The team
    `;
  }
}
