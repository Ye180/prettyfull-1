"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const address_schema_1 = require("../../shared/schemas/address.schema");
const address_module_1 = require("../address/address.module");
const notifications_module_1 = require("../notifications/notifications.module");
const product_schema_1 = require("../products/schemas/product.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const orders_schema_1 = require("./schemas/orders.schema");
const order_events_service_1 = require("./services/order-events.service");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: orders_schema_1.Order.name, schema: orders_schema_1.OrderSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchemaDefinition },
                { name: address_schema_1.Address.name, schema: address_schema_1.AddressSchemaDefinition },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            address_module_1.AddressModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, order_events_service_1.OrderEventsService],
        exports: [orders_service_1.OrdersService, order_events_service_1.OrderEventsService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map