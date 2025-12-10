import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// import { OrderDocument, PaymentStatus } from 'src/shared/schemas/order.schema';
// import { ProductDocument } from 'src/shared/schemas/product.schema';
import { PaymentStatus } from 'src/shared/schemas/payment.schema';
import { AddressService } from '../address/address.service';
import { AddressDto } from '../address/dto/address.dto';
import { NotificationsProducerService } from '../notifications/notifications.producer.service';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Order,
  OrderDocument,
  // OrderDocument,
  OrderStatus,
} from './schemas/orders.schema';
import { OrderEventsService } from './services/order-events.service';

export interface CreateOrderDto1 {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }>;
  shippingAddressInfo: AddressDto;
  billingAddressInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  billingAddress?: string;
  shippingAddress?: string;
  // paymentMethod: string;
  notes?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly notificationsProducer: NotificationsProducerService,
    private readonly addressService: AddressService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly orderEventsService: OrderEventsService,
  ) {}

  /**
   * Génère un numéro de commande unique
   * Format: ORD-YYYYMMDD-XXXX
   */
  private generateOrderNumber(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `ORD-${dateStr}-${randomNum}`;
  }

  //Get all orders
  async findAll(): Promise<OrderDocument[]> {
    const orders = await this.orderModel.find().exec();
    const transformedOrders = await Promise.all(
      orders.map(async (order: any) => ({
        id: order._id,
        items: order.items,
        user: await this.userModel.findById(order.userId).exec(),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddressInfo: order.shippingAddressInfo || order.shippingAddress,
        billingAddressInfo: order.billingAddressInfo || order.billingAddress,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        itemsCount: order.items?.length || 0,
      })),
    );

    return transformedOrders as any;
  }

  /**
   * Crée une nouvelle commande avec gestion atomique des stocksc
   */
  async createOrder(createOrderDto: CreateOrderDto1): Promise<OrderDocument> {
    try {
      // 1. Validation et récupération des produits
      const orderItems: any[] = [];
      let subtotalAmount = 0;

      for (const item of createOrderDto.items) {
        if (!Types.ObjectId.isValid(item.productId)) {
          throw new BadRequestException(
            `ID de produit invalide: ${item.productId}`,
          );
        }

        const product = await this.productModel.findById(item.productId).exec();

        if (!product) {
          throw new NotFoundException(`Produit non trouvé: ${item.productId}`);
        }

        const productData = product as any;

        // Vérifier le stock en fonction du type de produit (variants ou non)
        let stockQuantity = 0;
        if (item.selectedVariants && productData.variants) {
          // Produit avec variantes
          const selectedEntries = Object.entries(item.selectedVariants || {});
          const variantsArray = Array.isArray(productData.variants)
            ? (productData.variants as any[])
            : [];
          const variant = variantsArray.find((v: any) =>
            selectedEntries.every(([key, value]) => {
              const field = v?.[key];
              if (field && typeof field === 'object' && 'code' in field) {
                return field.code === value;
              }
              return field === value;
            }),
          );
          if (!variant) {
            throw new BadRequestException('Variante non trouvée');
          }
          stockQuantity = variant.quantity;
        } else if (productData.notVariable) {
          // Produit sans variantes
          stockQuantity = productData.notVariable.quantity;
        }

        if (stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Stock insuffisant pour le produit ${productData.name?.fr || productData.sku}`,
          );
        }

        // Calcul du prix avec gestion des promotions et devises
        const price = productData.promotion
          ? {
              amount: productData.promotion.reduced_price.amount.fr,
              currency: productData.promotion.reduced_price.currency.fr,
            }
          : {
              amount: productData.price.amount.fr,
              currency: productData.price.currency.fr,
            };

        const unitPrice = price.amount;
        const totalPrice = unitPrice * item.quantity;
        subtotalAmount += totalPrice;

        orderItems.push({
          product: new Types.ObjectId(item.productId),
          productId: new Types.ObjectId(item.productId),
          sku: productData.sku,
          name: productData.name,
          quantity: item.quantity,
          unitPrice: {
            amount: unitPrice,
            currency: price.currency,
          },
          totalPrice: {
            amount: totalPrice,
            currency: price.currency,
          },
          selectedVariants: item.selectedVariants || {},
          promotion: productData.promotion
            ? {
                reduced_price: {
                  amount: productData.promotion.reduced_price.amount,
                  currency: productData.promotion.reduced_price.currency,
                },
                pourcentage: productData.promotion.pourcentage,
              }
            : undefined,
        });

        // Décrémentation du stock
        if (item.selectedVariants && productData.variants) {
          await this.productModel.updateOne(
            {
              _id: item.productId,
              'variants.color.code': item.selectedVariants.color,
              'variants.size': item.selectedVariants.size,
            },
            { $inc: { 'variants.$.quantity': -item.quantity } },
          );
        } else if (productData.notVariable) {
          await this.productModel.updateOne(
            { _id: item.productId },
            { $inc: { 'notVariable.quantity': -item.quantity } },
          );
        }
      }

      const shippingAddressId = createOrderDto.shippingAddress;
      if (createOrderDto.shippingAddressInfo) {
        await this.addressService.createAddress({
          ...createOrderDto.shippingAddressInfo,
          userId: createOrderDto.userId,
        });
        // shippingAddressId = newAddress._id;
      }

      if (!shippingAddressId) {
        throw new BadRequestException('Adresse de livraison manquante.');
      }

      // 2. Calcul des totaux (pour l'instant, pas de frais de livraison ni de taxes)
      const shippingCost = { amount: 0, currency: 'XOF' };
      const taxAmount = { amount: 0, currency: 'XOF' };
      const discountAmount = { amount: 0, currency: 'XOF' };
      const totalAmount = {
        amount: subtotalAmount,
        currency: 'XOF',
      };

      // 3. Création de la commande
      const orderData = {
        orderNumber: this.generateOrderNumber(),
        userId: new Types.ObjectId(createOrderDto.userId),
        items: orderItems,
        subtotal: { amount: subtotalAmount, currency: 'XOF' },
        shippingCost,
        taxAmount,
        discountAmount,
        total: totalAmount, // Correction: le champ est 'total', pas 'totalAmount'
        currency: 'XOF', // Ajout du champ 'currency' manquant
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: shippingAddressId,
        billingAddress: createOrderDto.billingAddress || shippingAddressId,
        notes: createOrderDto.notes,
        statusHistory: [
          {
            message: 'Commande créée',
            timestamp: new Date(),
          },
        ],
      };

      const createdOrder = new this.orderModel(orderData);
      const savedOrder = await createdOrder.save();

      await this.sendOrderCreatedNotification(savedOrder);

      // Émettre événement SSE pour notification admin en temps réel
      const savedOrderData = savedOrder as any;
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

      if (adminEmails.length > 0) {
        this.orderEventsService.emitNewOrderNotification({
          orderId: savedOrder._id.toString(),
          orderNumber: savedOrderData.orderNumber,
          customerName: `User ${savedOrderData.userId}`, // À améliorer avec populate
          totalAmount: savedOrderData.total,
          timestamp: new Date(),
        });

        this.logger.log(
          `📡 SSE admin notification emitted for new order: ${savedOrderData.orderNumber}`,
        );
      }

      return savedOrder;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la commande:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erreur interne lors de la création de la commande',
      );
    }
  }

  /**
   * Récupère toutes les commandes d'un utilisateur
   */
  async findUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    orders: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel
        .countDocuments({ user: new Types.ObjectId(userId) })
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    const transformedOrders = orders.map((order: any) => ({
      id: order._id,
      items: order.items,
      user: order.userId,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingAddressInfo: order.shippingAddressInfo || order.shippingAddress,
      billingAddressInfo: order.billingAddressInfo || order.billingAddress,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemsCount: order.items?.length || 0,
    }));

    return {
      orders: transformedOrders,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Récupère une commande par ID
   */
  async findOne(orderId: string, userId?: string): Promise<any> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('ID de commande invalide');
    }

    const query: any = { _id: new Types.ObjectId(orderId) };
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('ID utilisateur invalide');
      }
      query.user = new Types.ObjectId(userId);
    }

    const order = await this.orderModel
      .findOne(query)
      .populate('user', 'firstName lastName email')
      .exec();

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return order;
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('ID de commande invalide');
    }

    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          message: message || `Statut mis à jour: ${status}`,
          timestamp: new Date(),
        },
      },
    };

    // Mise à jour des timestamps spécifiques selon le statut
    if (status === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(orderId, updateData, { new: true })
      .exec();

    // Émettre événement SSE pour tracking temps réel
    if (updatedOrder) {
      const statusMessages: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: 'Commande en attente de paiement',
        [OrderStatus.PAID]: 'Paiement confirmé',
        [OrderStatus.CONFIRMED]: "Commande confirmée par l'équipe",
        [OrderStatus.PROCESSING]: 'Commande en préparation',
        [OrderStatus.SHIPPED]: 'Commande en cours de livraison',
        [OrderStatus.DELIVERED]: 'Commande livrée avec succès',
        [OrderStatus.CANCELLED]: 'Commande annulée',
        [OrderStatus.REFUNDED]: 'Commande remboursée',
      };

      this.orderEventsService.emitOrderStatusUpdate({
        orderId: updatedOrder._id.toString(),
        status,
        timestamp: new Date(),
        message: message || statusMessages[status] || `Statut: ${status}`,
        metadata: {
          orderNumber: updatedOrder.orderNumber,
          previousStatus: order.status,
        },
      });

      this.logger.log(
        `📡 SSE event emitted for order ${updatedOrder.orderNumber}: ${status}`,
      );
    }

    return updatedOrder!;
  }

  //do a customer list whit total spent amount and number of orders
  async getCustomerList(): Promise<any[]> {
    const customers = await this.orderModel
      .aggregate([
        {
          $group: {
            _id: '$userId',
            totalSpent: { $sum: '$total.amount' },
            orderCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: '$userInfo',
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            name: {
              $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'],
            },
            email: '$userInfo.email',
            totalSpent: 1,
            orderCount: 1,
          },
        },
        {
          $sort: { totalSpent: -1 },
        },
      ])
      .exec();

    Logger.log(customers);

    return customers;
  }

  /**
   * Met à jour le statut de paiement
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('ID de commande invalide');
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          paymentStatus,
          updatedAt: new Date(),
          $push: {
            statusHistory: {
              message: `Statut de paiement mis à jour: ${paymentStatus}`,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException('Commande non trouvée');
    }

    return updatedOrder;
  }

  /**
   * Annule une commande et remet le stock à jour
   */
  async cancelOrder(
    orderId: string,
    reason: string = 'Annulation demandée',
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('ID de commande invalide');
    }

    // const session: ClientSession = await this.orderModel.db.startSession(); // SUPPRIMÉ

    try {
      // session.startTransaction(); // SUPPRIMÉ

      const order = await this.orderModel
        .findById(orderId)
        // .session(session) // SUPPRIMÉ
        .exec();

      if (!order) {
        throw new NotFoundException('Commande non trouvée');
      }

      const orderData = order as any;

      // Vérifier si la commande peut être annulée
      if (
        [
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
          OrderStatus.CANCELLED,
        ].includes(orderData.status)
      ) {
        throw new BadRequestException(
          'Cette commande ne peut pas être annulée',
        );
      }

      // Remettre le stock à jour
      for (const item of orderData.items) {
        await this.productModel
          .findByIdAndUpdate(
            item.product,
            {
              $inc: { stock: item.quantity },
              $set: { updatedAt: new Date() },
            },
            {
              /*session*/
            }, // SUPPRIMÉ
          )
          .exec();
      }

      // Mettre à jour le statut de la commande
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.CANCELLED,
            updatedAt: new Date(),
            $push: {
              statusHistory: {
                message: `Commande annulée: ${reason}`,
                timestamp: new Date(),
              },
            },
          },
          { new: true /*session*/ }, // SUPPRIMÉ
        )
        .exec();

      // await session.commitTransaction(); // SUPPRIMÉ

      console.log(`✅ Commande ${orderData.orderNumber} annulée avec succès`);

      // Envoyer la notification d'annulation
      await this.sendOrderCancelledNotification(
        updatedOrder as OrderDocument,
        reason,
      );

      return updatedOrder!;
    } catch (error) {
      // await session.abortTransaction(); // SUPPRIMÉ
      console.error("❌ Erreur lors de l'annulation de la commande:", error);
      throw error;
    } /*finally { // SUPPRIMÉ
      await session.endSession();
    }*/
  }

  // ============================================================================
  // PRIVATE NOTIFICATION HELPERS
  // ============================================================================

  /**
   * Envoyer une notification de commande créée
   */
  private sendOrderCreatedNotification(order: OrderDocument) {
    try {
      console.log(order);
      const orderData = order as any;

      return orderData;
      // // Populate user pour obtenir l'email
      // const populatedOrder = await this.orderModel
      //   .findById(order._id)
      //   .populate('user')
      //   .exec();
      // if (!populatedOrder) return;
      // const userData = (populatedOrder as any).user;
      // await this.notificationsProducer.sendOrderCreatedNotification(
      //   {
      //     orderId: order._id as any,
      //     orderNumber: orderData.orderNumber,
      //     userId: userData._id,
      //     userEmail: userData.email || orderData.shippingAddress.email,
      //     userName: userData.name || orderData.shippingAddress.firstName,
      //     total: orderData.totalAmount,
      //     items: ((orderData.items as OrderItem[]) || [])?.map((item: any) => ({
      //       name: item.name?.fr || item.sku,
      //       quantity: item.quantity,
      //       price: item.unitPrice,
      //     })),
      //     shippingAddress: {
      //       fullName: `${orderData.shippingAddress.firstName} ${orderData.shipping`Addres`s.lastName}`,
      //       street: orderData.shippingAddress.street,
      //       city: orderData.shippingAddress.city,
      //       country: orderData.shippingAddress.country,
      //     },
      //   },
      //   'fr',
      // );
    } catch (error) {
      const err = error as Error;
      console.error(
        `❌ Erreur lors de l'envoi de la notification de commande créée: ${err.message}`,
      );
      // Ne pas bloquer le processus de commande si la notification échoue
    }
  }

  /**
   * Envoyer une notification de commande annulée
   */
  private async sendOrderCancelledNotification(
    order: OrderDocument,
    reason: string,
  ): Promise<void> {
    try {
      const orderData = order as any;
      console.log(reason);

      const populatedOrder = await this.orderModel
        .findById(order._id)
        .populate('user')
        .exec();

      if (!populatedOrder) return;

      // TODO Module 2: Implémenter template email annulation commande
      // const userData = (populatedOrder as any).user;
      // await this.notificationsProducer.queueOrderCancellation({
      //   orderId: order._id.toString(),
      //   orderNumber: orderData.orderNumber,
      //   customerEmail: userData.email || orderData.shippingAddress.email,
      //   customerName: userData.name || orderData.shippingAddress.fullName,
      //   reason,
      //   language: 'fr',
      // });
      console.log(
        `📧 Order cancelled notification skipped (template not implemented yet): ${orderData.orderNumber}`,
      );
    } catch (error) {
      const err = error as Error;
      console.error(
        `❌ Erreur lors de l'envoi de la notification d'annulation: ${err.message}`,
      );
      // Ne pas bloquer le processus d'annulation si la notification échoue
    }
  }

  /**
   * Module 4: Delivery System - Generate 6-character validation code
   */
  private generateValidationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }

  /**
   * Module 4: Assign driver to order (Admin only)
   */
  async assignDriver(
    orderId: string,
    driverId: string,
    estimatedDelivery: Date,
  ): Promise<OrderDocument> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException("L'ID de la commande n'est pas valide");
    }
    if (!Types.ObjectId.isValid(driverId)) {
      throw new BadRequestException("L'ID du livreur n'est pas valide");
    }

    // Find order
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Verify driver exists
    const driver = await this.userModel.findById(driverId).lean();
    if (!driver) {
      throw new NotFoundException('Livreur introuvable');
    }

    // Generate validation code
    const validationCode = this.generateValidationCode();

    // Update order
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          driverId: new Types.ObjectId(driverId),
          validationCode,
          estimatedDelivery,
          assignedAt: new Date(),
          status: OrderStatus.SHIPPED, // Transition to SHIPPED when assigned
        },
        { new: true },
      )
      .populate('userId', 'name email')
      .populate('shippingAddress');

    if (!updatedOrder) {
      throw new InternalServerErrorException(
        "Erreur lors de l'assignation du livreur",
      );
    }

    // Send email with validation code (Module 2 integration)
    try {
      const userData = (updatedOrder as any).userId;
      const shippingData = (updatedOrder as any).shippingAddress;

      await this.notificationsProducer.queueOrderShipment({
        orderId: updatedOrder._id.toString(),
        customerEmail: userData?.email || shippingData?.email || '',
        customerName: userData?.name || shippingData?.fullName || '',
        trackingCode: validationCode,
        carrier: 'Livreur interne',
        estimatedDelivery: estimatedDelivery,
        items: updatedOrder.items.map((item: any) => ({
          name: item.name?.fr || item.name?.en || 'Produit',
          quantity: item.quantity,
        })),
        language: 'fr', // TODO: Get from order/user preferences
      });
      this.logger.log(
        `📧 Email de livraison envoyé avec code ${validationCode} pour commande ${updatedOrder.orderNumber}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `❌ Erreur lors de l'envoi de l'email de livraison: ${err.message}`,
      );
      // Continue even if email fails
    }

    // Emit SSE event (Module 3 integration)
    this.orderEventsService.emitOrderStatusUpdate({
      orderId: updatedOrder._id.toString(),
      status: OrderStatus.SHIPPED,
      timestamp: new Date(),
      message: `Commande assignée au livreur. Code de validation: ${validationCode}`,
      metadata: {
        validationCode,
        estimatedDelivery: estimatedDelivery.toISOString(),
      },
    });

    this.logger.log(
      `✅ Livreur ${driverId} assigné à la commande ${order.orderNumber} avec code ${validationCode}`,
    );

    return updatedOrder;
  }

  /**
   * Module 4: Get driver's assigned orders (Driver only)
   */
  async getDriverOrders(
    driverId: string,
    filters?: {
      status?: OrderStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<OrderDocument[]> {
    if (!Types.ObjectId.isValid(driverId)) {
      throw new BadRequestException("L'ID du livreur n'est pas valide");
    }

    const query: any = {
      driverId: new Types.ObjectId(driverId),
    };

    // Apply filters
    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      query.assignedAt = {};
      if (filters.startDate) {
        query.assignedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.assignedAt.$lte = filters.endDate;
      }
    }

    const orders = await this.orderModel
      .find(query)
      .populate('userId', 'name email')
      .populate('shippingAddress')
      .sort({ assignedAt: -1 });

    this.logger.log(
      `📦 Récupération de ${orders.length} commandes pour le livreur ${driverId}`,
    );

    return orders;
  }

  /**
   * Module 4: Validate delivery with code (Driver only)
   */
  async validateDelivery(
    orderId: string,
    driverId: string,
    validationCode: string,
    deliveryNote?: string,
    signatureUrl?: string,
  ): Promise<OrderDocument> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException("L'ID de la commande n'est pas valide");
    }

    // Find order
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Verify driver is assigned to this order
    if (!order.driverId || order.driverId.toString() !== driverId) {
      throw new BadRequestException("Vous n'êtes pas assigné à cette commande");
    }

    // Verify validation code
    if (order.validationCode !== validationCode.toUpperCase()) {
      throw new BadRequestException('Code de validation incorrect');
    }

    // Verify order is in correct status
    if (order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException(
        'Cette commande ne peut pas être validée (statut incorrect)',
      );
    }

    // Update order to DELIVERED
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        status: OrderStatus.DELIVERED,
        deliveryNote,
        signatureUrl,
        deliveredAt: new Date(),
      },
      { new: true },
    );

    if (!updatedOrder) {
      throw new InternalServerErrorException(
        'Erreur lors de la validation de la livraison',
      );
    }

    // Emit SSE event (Module 3 integration)
    this.orderEventsService.emitOrderStatusUpdate({
      orderId: updatedOrder._id.toString(),
      status: OrderStatus.DELIVERED,
      timestamp: new Date(),
      message: 'Commande livrée avec succès',
      metadata: {
        deliveryNote,
        signatureUrl,
      },
    });

    // TODO: Send delivery confirmation email to customer (Module 2 - create template)

    this.logger.log(
      `✅ Livraison validée pour commande ${order.orderNumber} par livreur ${driverId}`,
    );

    return updatedOrder;
  }
}
