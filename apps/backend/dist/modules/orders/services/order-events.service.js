"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OrderEventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let OrderEventsService = OrderEventsService_1 = class OrderEventsService {
    logger = new common_1.Logger(OrderEventsService_1.name);
    orderStatusUpdates$ = new rxjs_1.Subject();
    newOrderNotifications$ = new rxjs_1.Subject();
    emitOrderStatusUpdate(event) {
        this.logger.log(`📡 Broadcasting status update for order ${event.orderId}: ${event.status}`);
        this.orderStatusUpdates$.next(event);
    }
    emitNewOrderNotification(event) {
        this.logger.log(`📡 Broadcasting new order notification: ${event.orderNumber}`);
        this.newOrderNotifications$.next(event);
    }
    subscribeToOrder(orderId) {
        this.logger.log(`📺 Client subscribed to order ${orderId}`);
        return this.orderStatusUpdates$.pipe((0, operators_1.filter)((event) => event.orderId === orderId), (0, operators_1.map)((event) => {
            this.logger.debug(`📤 Sending event to client for order ${orderId}: ${event.status}`);
            return event;
        }));
    }
    subscribeToNewOrders() {
        this.logger.log(`📺 Admin subscribed to new order notifications`);
        return this.newOrderNotifications$;
    }
    getActiveSubscribersCount() {
        return {
            orderUpdates: this.orderStatusUpdates$.observers.length,
            newOrders: this.newOrderNotifications$.observers.length,
        };
    }
};
exports.OrderEventsService = OrderEventsService;
exports.OrderEventsService = OrderEventsService = OrderEventsService_1 = __decorate([
    (0, common_1.Injectable)()
], OrderEventsService);
//# sourceMappingURL=order-events.service.js.map