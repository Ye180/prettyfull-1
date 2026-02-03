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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsProducerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProducerService = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const notification_types_1 = require("./types/notification.types");
let NotificationsProducerService = NotificationsProducerService_1 = class NotificationsProducerService {
    orderConfirmationQueue;
    newOrderAdminQueue;
    orderShipmentQueue;
    logger = new common_1.Logger(NotificationsProducerService_1.name);
    constructor(orderConfirmationQueue, newOrderAdminQueue, orderShipmentQueue) {
        this.orderConfirmationQueue = orderConfirmationQueue;
        this.newOrderAdminQueue = newOrderAdminQueue;
        this.orderShipmentQueue = orderShipmentQueue;
    }
    async queueOrderConfirmation(data) {
        try {
            const job = await this.orderConfirmationQueue.add(notification_types_1.NotificationJobName.SEND_ORDER_CONFIRMATION, data, {
                priority: 1,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
            this.logger.log(`Order confirmation notification queued: ${data.orderId} (Job ID: ${job.id})`);
            return job;
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to queue order confirmation: ${err.message}`, err.stack);
            throw error;
        }
    }
    async queueNewOrderAdmin(data) {
        try {
            const job = await this.newOrderAdminQueue.add(notification_types_1.NotificationJobName.SEND_NEW_ORDER_NOTIFICATION, data, {
                priority: 2,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
            this.logger.log(`New order admin notification queued: ${data.orderId} (Job ID: ${job.id})`);
            return job;
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to queue new order admin notification: ${err.message}`, err.stack);
            throw error;
        }
    }
    async queueOrderShipment(data) {
        try {
            const job = await this.orderShipmentQueue.add(notification_types_1.NotificationJobName.SEND_SHIPMENT_CODE, data, {
                priority: 1,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
            this.logger.log(`Order shipment notification queued: ${data.orderId} (Job ID: ${job.id})`);
            return job;
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to queue order shipment notification: ${err.message}`, err.stack);
            throw error;
        }
    }
    async getQueueStats() {
        const [orderConfirmationStats, newOrderAdminStats, orderShipmentStats] = await Promise.all([
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
    async getQueueStatsForQueue(queue) {
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
};
exports.NotificationsProducerService = NotificationsProducerService;
exports.NotificationsProducerService = NotificationsProducerService = NotificationsProducerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(notification_types_1.NotificationQueue.ORDER_CONFIRMATION)),
    __param(1, (0, bullmq_1.InjectQueue)(notification_types_1.NotificationQueue.NEW_ORDER_ADMIN)),
    __param(2, (0, bullmq_1.InjectQueue)(notification_types_1.NotificationQueue.ORDER_SHIPMENT)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], NotificationsProducerService);
//# sourceMappingURL=notifications.producer.service.js.map