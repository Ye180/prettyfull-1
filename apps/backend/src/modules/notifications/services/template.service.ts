import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

/**
 * ============================================================================
 * TEMPLATE SERVICE - Handlebars Integration
 * ============================================================================
 *
 * Service responsable du rendu des templates HTML avec Handlebars.
 * Les templates sont stockés dans /templates/*.hbs
 *
 * Templates disponibles:
 * - order-confirmation.fr.hbs / order-confirmation.en.hbs
 * - new-order-admin.hbs
 * - order-shipment.fr.hbs / order-shipment.en.hbs
 * ============================================================================
 */
@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly templatesDir: string;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
    this.logger.log(`📄 Template service initialized: ${this.templatesDir}`);

    // Register Handlebars helpers
    this.registerHelpers();
  }

  /**
   * Enregistre des helpers Handlebars personnalisés
   */
  private registerHelpers(): void {
    // Helper pour formatter les montants
    Handlebars.registerHelper(
      'formatCurrency',
      (amount: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: currency || 'USD',
        }).format(amount);
      },
    );

    // Helper pour formatter les dates
    Handlebars.registerHelper(
      'formatDate',
      (date: Date, locale: string = 'fr') => {
        return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
          dateStyle: 'long',
        }).format(new Date(date));
      },
    );

    // Helper conditionnel
    Handlebars.registerHelper('eq', (a: any, b: any) => {
      return a === b;
    });
  }

  /**
   * Rend un template avec des données
   */
  render(
    templateName: string,
    data: Record<string, any>,
    language: 'fr' | 'en' = 'fr',
  ): string {
    try {
      // Construire le nom du fichier avec la langue
      const templateFileName = `${templateName}.${language}.hbs`;
      const cacheKey = templateFileName;

      // Vérifier le cache
      let template = this.templateCache.get(cacheKey);

      if (!template) {
        // Charger et compiler le template
        const templatePath = path.join(this.templatesDir, templateFileName);

        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found: ${templatePath}`);
        }

        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        template = Handlebars.compile(templateSource);

        // Mettre en cache
        this.templateCache.set(cacheKey, template);
        this.logger.debug(`Template loaded and cached: ${templateFileName}`);
      }

      // Rendre le template
      const html = template(data);
      return html;
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Nettoie le cache des templates
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logger.log('Template cache cleared');
  }
}
