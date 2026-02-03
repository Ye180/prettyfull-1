"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrderConfirmationProcessor_1, NewOrderAdminProcessor_1, OrderShipmentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderShipmentProcessor = exports.NewOrderAdminProcessor = exports.OrderConfirmationProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const email_service_1 = require("./services/email.service");
const template_service_1 = require("./services/template.service");
const notification_types_1 = require("./types/notification.types");
let OrderConfirmationProcessor = OrderConfirmationProcessor_1 = class OrderConfirmationProcessor extends bullmq_1.WorkerHost {
    emailService;
    templateService;
    logger = new common_1.Logger(OrderConfirmationProcessor_1.name);
    constructor(emailService, templateService) {
        super();
        this.emailService = emailService;
        this.templateService = templateService;
    }
    async process(job) {
        this.logger.log(`Processing order confirmation (Job ${job.id}, Order: ${job.data.orderId})...`);
        try {
            const { customerEmail, language } = job.data;
            const htmlContent = this.templateService.render('order-confirmation', job.data, language);
            const result = await this.emailService.sendEmail({
                to: customerEmail,
                subject: language === 'fr'
                    ? 'Confirmation de votre commande'
                    : 'Order Confirmation',
                html: htmlContent,
            });
            if (result.success) {
                this.logger.log(`✅ Order confirmation sent to ${customerEmail} (Order: ${job.data.orderId}, MessageID: ${result.messageId})`);
                return {
                    success: true,
                    messageId: result.messageId,
                    timestamp: new Date(),
                };
            }
            else {
                this.logger.error(`❌ Failed to send order confirmation to ${customerEmail}: ${result.error}`);
                throw new Error(result.error);
            }
        }
        catch (error) {
            const err = error;
            this.logger.error(`❌ Failed to process order confirmation job ${job.id}: ${err.message}`, err.stack);
            throw error;
        }
    }
};
exports.OrderConfirmationProcessor = OrderConfirmationProcessor;
exports.OrderConfirmationProcessor = OrderConfirmationProcessor = OrderConfirmationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(notification_types_1.NotificationQueue.ORDER_CONFIRMATION),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        template_service_1.TemplateService])
], OrderConfirmationProcessor);
let NewOrderAdminProcessor = NewOrderAdminProcessor_1 = class NewOrderAdminProcessor extends bullmq_1.WorkerHost {
    emailService;
    templateService;
    logger = new common_1.Logger(NewOrderAdminProcessor_1.name);
    constructor(emailService, templateService) {
        super();
        this.emailService = emailService;
        this.templateService = templateService;
    }
    async process(job) {
        this.logger.log(`Processing new order admin notification (Job ${job.id}, Order: ${job.data.orderId})...`);
        try {
            const { adminEmails, orderId } = job.data;
            const htmlContent = this.templateService.render('new-order-admin', job.data, 'fr');
            const results = await Promise.allSettled(adminEmails.map((adminEmail) => this.emailService.sendEmail({
                to: adminEmail,
                subject: `🛒 Nouvelle commande #${orderId.slice(-8)}`,
                html: htmlContent,
            })));
            const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
            const failCount = results.length - successCount;
            if (successCount > 0) {
                this.logger.log(`✅ New order admin notification sent to ${successCount}/${adminEmails.length} admins (Order: ${orderId})`);
            }
            if (failCount > 0) {
                this.logger.warn(`⚠️ Failed to send to ${failCount}/${adminEmails.length} admins (Order: ${orderId})`);
            }
            if (successCount > 0) {
                return { success: true, timestamp: new Date() };
            }
            else {
                throw new Error('Failed to send to any admin');
            }
        }
        catch (error) {
            const err = error;
            this.logger.error(`❌ Failed to process new order admin job ${job.id}: ${err.message}`, err.stack);
            throw error;
        }
    }
};
exports.NewOrderAdminProcessor = NewOrderAdminProcessor;
exports.NewOrderAdminProcessor = NewOrderAdminProcessor = NewOrderAdminProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(notification_types_1.NotificationQueue.NEW_ORDER_ADMIN),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        template_service_1.TemplateService])
], NewOrderAdminProcessor);
let OrderShipmentProcessor = OrderShipmentProcessor_1 = class OrderShipmentProcessor extends bullmq_1.WorkerHost {
    emailService;
    templateService;
    logger = new common_1.Logger(OrderShipmentProcessor_1.name);
    constructor(emailService, templateService) {
        super();
        this.emailService = emailService;
        this.templateService = templateService;
    }
    async process(job) {
        this.logger.log(`Processing order shipment notification (Job ${job.id}, Order: ${job.data.orderId})...`);
        try {
            const { customerEmail, language, trackingCode, orderId } = job.data;
            const htmlContent = this.templateService.render('order-shipment', job.data, language);
            const result = await this.emailService.sendEmail({
                to: customerEmail,
                subject: language === 'fr'
                    ? `📦 Votre colis est en route - Code de suivi: ${trackingCode}`
                    : `📦 Your package is on the way - Tracking: ${trackingCode}`,
                html: htmlContent,
            });
            if (result.success) {
                this.logger.log(`✅ Shipment notification sent to ${customerEmail} (Order: ${orderId}, Tracking: ${trackingCode}, MessageID: ${result.messageId})`);
                return {
                    success: true,
                    messageId: result.messageId,
                    timestamp: new Date(),
                };
            }
            else {
                this.logger.error(`❌ Failed to send shipment notification to ${customerEmail}: ${result.error}`);
                throw new Error(result.error);
            }
        }
        catch (error) {
            const err = error;
            this.logger.error(`❌ Failed to process shipment notification job ${job.id}: ${err.message}`, err.stack);
            throw error;
        }
    }
};
exports.OrderShipmentProcessor = OrderShipmentProcessor;
exports.OrderShipmentProcessor = OrderShipmentProcessor = OrderShipmentProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(notification_types_1.NotificationQueue.ORDER_SHIPMENT),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        template_service_1.TemplateService])
], OrderShipmentProcessor);
//# sourceMappingURL=notifications.processor.js.map