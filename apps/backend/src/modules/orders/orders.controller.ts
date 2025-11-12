import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Roles, Session } from '@thallesp/nestjs-better-auth';
import { PaymentStatus } from 'src/shared/schemas/payment.schema';
// import type { CreateOrderDto } from './orders.service';
import { OrdersService } from './orders.service';
import { OrderStatus } from './schemas/orders.schema';
import { OrderEventsService } from './services/order-events.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderEventsService: OrderEventsService,
  ) {}

  /**
   * POST /orders - Authenticated
   * Crée une nouvelle commande
   */
  @Post()
  async create(@Body() createOrderDto, @Session() session: UserSession) {
    return this.ordersService.createOrder(createOrderDto);
  }

  /**
   * GET /orders/:id/track - SSE Endpoint
   * Streaming temps réel des updates de statut de commande
   * Accept: text/event-stream
   */
  @Get(':id/track')
  @AllowAnonymous() // Permettre le tracking sans auth (client peut avoir le lien)
  @Sse()
  trackOrder(@Param('id') orderId: string): Observable<MessageEvent> {
    return this.orderEventsService.subscribeToOrder(orderId).pipe(
      map((event) => ({
        data: {
          status: event.status,
          message: event.message,
          timestamp: event.timestamp,
          metadata: event.metadata,
        },
        type: 'status-update',
      })),
    );
  }

  /**
   * GET /orders/admin/live - SSE Endpoint Admin
   * Streaming temps réel des nouvelles commandes pour les admins
   * Accept: text/event-stream
   */
  @Get('admin/live')
  @Roles(['admin'])
  @Sse()
  liveAdminOrders(@Session() session: UserSession): Observable<MessageEvent> {
    return this.orderEventsService.subscribeToNewOrders().pipe(
      map((event) => ({
        data: {
          orderId: event.orderId,
          orderNumber: event.orderNumber,
          customerName: event.customerName,
          totalAmount: event.totalAmount,
          timestamp: event.timestamp,
        },
        type: 'new-order',
      })),
    );
  }

  /**
   * GET /orders/admin/subscribers - Admin only
   * Monitoring du nombre de connexions SSE actives
   */
  @Get('admin/subscribers')
  @Roles(['admin'])
  getActiveSubscribers() {
    return this.orderEventsService.getActiveSubscribersCount();
  }

  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.ordersService.findAll();
  }

  /**
   * GET /orders - Authenticated
   * Liste les commandes de l'utilisateur
   */
  @Get('user')
  async findUserOrders(
    @Query('userId') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Session() session: UserSession,
  ) {
    return this.ordersService.findUserOrders(userId, page, limit);
  }

  /**
   * GET /orders/:id - Authenticated
   * Récupère une commande par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: UserSession) {
    return this.ordersService.findOne(id);
  }

  /*Get Customer list*/
  @Get('customer/list')
  @AllowAnonymous()
  async getCustomerList() {
    return this.ordersService.getCustomerList();
  }

  /**
   * PATCH /orders/:id/status - Admin only
   * Met à jour le statut d'une commande
   */
  @Patch(':id/status')
  @Roles(['admin'])
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Session() session: UserSession,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  /**
   * PATCH /orders/:id/payment-status - Admin only
   * Met à jour le statut de paiement
   */
  @Patch(':id/payment-status')
  @Roles(['admin'])
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
    @Session() session: UserSession,
  ) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  /**
   * POST /orders/:id/cancel - Authenticated
   * Annule une commande
   */
  @Post(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Session() session: UserSession,
  ) {
    return this.ordersService.cancelOrder(id, reason);
  }
}
