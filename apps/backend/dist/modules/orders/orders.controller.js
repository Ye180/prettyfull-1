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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const payment_schema_1 = require("../../shared/schemas/payment.schema");
const orders_service_1 = require("./orders.service");
const orders_schema_1 = require("./schemas/orders.schema");
const order_events_service_1 = require("./services/order-events.service");
let OrdersController = class OrdersController {
    ordersService;
    orderEventsService;
    constructor(ordersService, orderEventsService) {
        this.ordersService = ordersService;
        this.orderEventsService = orderEventsService;
    }
    async create(createOrderDto, session) {
        return this.ordersService.createOrder(createOrderDto);
    }
    trackOrder(orderId) {
        return this.orderEventsService.subscribeToOrder(orderId).pipe((0, operators_1.map)((event) => ({
            data: {
                status: event.status,
                message: event.message,
                timestamp: event.timestamp,
                metadata: event.metadata,
            },
            type: 'status-update',
        })));
    }
    liveAdminOrders(session) {
        return this.orderEventsService.subscribeToNewOrders().pipe((0, operators_1.map)((event) => ({
            data: {
                orderId: event.orderId,
                orderNumber: event.orderNumber,
                customerName: event.customerName,
                totalAmount: event.totalAmount,
                timestamp: event.timestamp,
            },
            type: 'new-order',
        })));
    }
    getActiveSubscribers() {
        return this.orderEventsService.getActiveSubscribersCount();
    }
    async findAll() {
        return this.ordersService.findAll();
    }
    async findUserOrders(userId, page = 1, limit = 10, session) {
        return this.ordersService.findUserOrders(userId, page, limit);
    }
    async findOne(id, session) {
        return this.ordersService.findOne(id);
    }
    async getCustomerList() {
        return this.ordersService.getCustomerList();
    }
    async updateStatus(id, status, session) {
        return this.ordersService.updateStatus(id, status);
    }
    async updatePaymentStatus(id, paymentStatus, session) {
        return this.ordersService.updatePaymentStatus(id, paymentStatus);
    }
    async cancelOrder(id, reason, session) {
        return this.ordersService.cancelOrder(id, reason);
    }
    async assignDriver(orderId, assignDriverDto) {
        const estimatedDelivery = new Date(assignDriverDto.estimatedDelivery);
        const order = await this.ordersService.assignDriver(orderId, assignDriverDto.driverId, estimatedDelivery);
        return {
            success: true,
            message: 'Livreur assigné avec succès',
            data: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                driverId: order.driverId?.toString(),
                validationCode: order.validationCode,
                estimatedDelivery: order.estimatedDelivery,
                status: order.status,
            },
        };
    }
    async getDriverOrders(session, status, startDate, endDate) {
        const filters = {};
        if (status)
            filters.status = status;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        const orders = await this.ordersService.getDriverOrders(session.user.id, filters);
        return {
            success: true,
            data: orders.map((order) => ({
                orderId: order._id?.toString(),
                orderNumber: order.orderNumber,
                status: order.status,
                validationCode: order.validationCode,
                estimatedDelivery: order.estimatedDelivery,
                assignedAt: order.assignedAt,
                shippingAddress: order.shippingAddress,
                items: order.items,
                customer: order.userId
                    ? {
                        name: order.userId.name,
                        email: order.userId.email,
                    }
                    : null,
            })),
            count: orders.length,
        };
    }
    async validateDelivery(orderId, validateDto, session) {
        const order = await this.ordersService.validateDelivery(orderId, session.user.id, validateDto.validationCode, validateDto.deliveryNote, validateDto.signatureUrl);
        return {
            success: true,
            message: 'Livraison validée avec succès',
            data: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                status: order.status,
                deliveredAt: order.deliveredAt,
                deliveryNote: order.deliveryNote,
            },
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    openapi.ApiOperation({ summary: "POST /orders - Authenticated\nCr\u00E9e une nouvelle commande" }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /orders/:id/track - SSE Endpoint\nStreaming temps r\u00E9el des updates de statut de commande\nAccept: text/event-stream" }),
    (0, common_1.Get)(':id/track'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Sse)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], OrdersController.prototype, "trackOrder", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /orders/admin/live - SSE Endpoint Admin\nStreaming temps r\u00E9el des nouvelles commandes pour les admins\nAccept: text/event-stream" }),
    (0, common_1.Get)('admin/live'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    (0, common_1.Sse)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], OrdersController.prototype, "liveAdminOrders", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /orders/admin/subscribers - Admin only\nMonitoring du nombre de connexions SSE actives" }),
    (0, common_1.Get)('admin/subscribers'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getActiveSubscribers", null);
__decorate([
    (0, common_1.Get)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /orders - Authenticated\nListe les commandes de l'utilisateur" }),
    (0, common_1.Get)('user'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(3, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findUserOrders", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /orders/:id - Authenticated\nR\u00E9cup\u00E8re une commande par son ID" }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('customer/list'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getCustomerList", null);
__decorate([
    openapi.ApiOperation({ summary: "PATCH /orders/:id/status - Admin only\nMet \u00E0 jour le statut d'une commande" }),
    (0, common_1.Patch)(':id/status'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    openapi.ApiOperation({ summary: "PATCH /orders/:id/payment-status - Admin only\nMet \u00E0 jour le statut de paiement" }),
    (0, common_1.Patch)(':id/payment-status'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('paymentStatus')),
    __param(2, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updatePaymentStatus", null);
__decorate([
    openapi.ApiOperation({ summary: "POST /orders/:id/cancel - Authenticated\nAnnule une commande" }),
    (0, common_1.Post)(':id/cancel'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    openapi.ApiOperation({ summary: "Module 4: POST /admin/orders/:orderId/assign-driver\nAdmin assigne un livreur \u00E0 une commande" }),
    (0, common_1.Post)('admin/:orderId/assign-driver'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "assignDriver", null);
__decorate([
    openapi.ApiOperation({ summary: "Module 4: GET /driver/me/orders\nLivreur r\u00E9cup\u00E8re ses commandes assign\u00E9es" }),
    (0, common_1.Get)('driver/me/orders'),
    (0, nestjs_better_auth_1.Roles)(['driver']),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getDriverOrders", null);
__decorate([
    openapi.ApiOperation({ summary: "Module 4: POST /driver/orders/:orderId/validate-delivery\nLivreur valide la livraison avec le code" }),
    (0, common_1.Post)('driver/:orderId/validate-delivery'),
    (0, nestjs_better_auth_1.Roles)(['driver']),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "validateDelivery", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        order_events_service_1.OrderEventsService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map