import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaymentStatus } from 'src/shared/schemas/payment.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
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
  @UseGuards(JwtAuthGuard)
  //CHAN
  async create(@Body() createOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.ordersService.findAll();
  }

  /**
   * GET /orders - Authenticated
   * Liste les commandes de l'utilisateur
   */
  @Get()
  // @UseGuards(JwtAuthGuard)
  async findUserOrders(
    @Query('userId') userId: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.ordersService.findUserOrders(userId, page, limit);
  }

  /**
   * GET /orders/:id - Authenticated
   * Récupère une commande par son ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  /*Get Customer list*/
  @Get('customer/list')
  async getCustomerList() {
    return this.ordersService.getCustomerList();
  }

  /**
   * PATCH /orders/:id/status - Admin only
   * Met à jour le statut d'une commande
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  /**
   * PATCH /orders/:id/payment-status - Admin only
   * Met à jour le statut de paiement
   */
  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
  ) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  /**
   * POST /orders/:id/cancel - Authenticated
   * Annule une commande
   */
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') id: string, @Body('reason') reason: string) {
    return this.ordersService.cancelOrder(id, reason);
  }
}
