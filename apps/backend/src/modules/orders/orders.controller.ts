import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Roles, Session } from '@thallesp/nestjs-better-auth';
import { PaymentStatus } from 'src/shared/schemas/payment.schema';
// import type { CreateOrderDto } from './orders.service';
import { OrdersService } from './orders.service';
import { OrderStatus } from './schemas/orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders - Authenticated
   * Crée une nouvelle commande
   */
  @Post()
  async create(@Body() createOrderDto, @Session() session: UserSession) {
    return this.ordersService.createOrder(createOrderDto);
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
