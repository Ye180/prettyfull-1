"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const notifications_processor_1 = require("./notifications.processor");
const notifications_producer_service_1 = require("./notifications.producer.service");
const email_service_1 = require("./services/email.service");
const template_service_1 = require("./services/template.service");
const notification_types_1 = require("./types/notification.types");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379', 10),
                    password: process.env.REDIS_PASSWORD || undefined,
                },
            }),
            bullmq_1.BullModule.registerQueue({
                name: notification_types_1.NotificationQueue.ORDER_CONFIRMATION,
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: false,
                },
            }, {
                name: notification_types_1.NotificationQueue.NEW_ORDER_ADMIN,
                defaultJobOptions: {
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 3000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: false,
                },
            }, {
                name: notification_types_1.NotificationQueue.ORDER_SHIPMENT,
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: false,
                },
            }),
        ],
        providers: [
            notifications_producer_service_1.NotificationsProducerService,
            notifications_processor_1.OrderConfirmationProcessor,
            notifications_processor_1.NewOrderAdminProcessor,
            notifications_processor_1.OrderShipmentProcessor,
            email_service_1.EmailService,
            template_service_1.TemplateService,
        ],
        exports: [notifications_producer_service_1.NotificationsProducerService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map