import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailData } from '../types/notification.types';

/**
 * ============================================================================
 * EMAIL SERVICE - Nodemailer Integration
 * ============================================================================
 *
 * Service responsable de l'envoi d'emails via SMTP.
 * Configuration via variables d'environnement.
 *
 * Variables requises:
 * - SMTP_HOST: Serveur SMTP (ex: smtp.gmail.com)
 * - SMTP_PORT: Port SMTP (ex: 587)
 * - SMTP_USER: Utilisateur SMTP
 * - SMTP_PASSWORD: Mot de passe SMTP
 * - SMTP_FROM: Email expéditeur par défaut
 * ============================================================================
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.logger.log(
      `✉️  Email service initialized with SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`,
    );
  }

  /**
   * Envoie un email
   */
  async sendEmail(emailData: EmailData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const info = await this.transporter.sendMail({
        from:
          emailData.from || process.env.SMTP_FROM || 'noreply@prettyfull.com',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });

      this.logger.log(`✅ Email sent successfully: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to send email:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Vérifie la connexion SMTP
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      this.logger.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}
