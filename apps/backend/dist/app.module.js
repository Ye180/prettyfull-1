"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bull_1 = require("@nestjs/bull");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const redis_1 = require("./shared/redis");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const auth_1 = require("./auth");
const address_module_1 = require("./modules/address/address.module");
const carts_module_1 = require("./modules/carts/carts.module");
const categories_module_1 = require("./modules/categories/categories.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const orders_module_1 = require("./modules/orders/orders.module");
const products_module_1 = require("./modules/products/products.module");
const site_content_module_1 = require("./modules/site-content/site-content.module");
const storage_module_1 = require("./modules/storage/storage.module");
const users_module_1 = require("./modules/users/users.module");
const wishlists_module_1 = require("./modules/wishlists/wishlists.module");
const bootstrap_module_1 = require("./shared/database/bootstrap/bootstrap.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.get('DATABASE_URL') ||
                        'mongodb://localhost:27017/prettyfull-ecommerce',
                    retryWrites: true,
                    retryAttempts: 3,
                    retryDelay: 1000,
                }),
                inject: [config_1.ConfigService],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: (configService) => ({
                    store: 'redis',
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: configService.get('REDIS_PORT') || 6379,
                    password: configService.get('REDIS_PASSWORD'),
                    ttl: 300,
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST') || 'localhost',
                        port: configService.get('REDIS_PORT') || 6379,
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: (configService) => [
                    {
                        ttl: (configService.get('THROTTLE_TTL') || 60) * 1000,
                        limit: configService.get('THROTTLE_LIMIT') || 100,
                    },
                ],
                inject: [config_1.ConfigService],
            }),
            redis_1.RedisModule,
            nestjs_better_auth_1.AuthModule.forRoot({ auth: auth_1.auth }),
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            orders_module_1.OrdersModule,
            carts_module_1.CartsModule,
            wishlists_module_1.WishlistsModule,
            address_module_1.AddressModule,
            notifications_module_1.NotificationsModule,
            site_content_module_1.SiteContentModule,
            storage_module_1.StorageModule,
            bootstrap_module_1.BootstrapModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map