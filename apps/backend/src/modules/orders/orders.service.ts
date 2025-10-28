import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
// import { OrderDocument, PaymentStatus } from 'src/shared/schemas/order.schema';
// import { ProductDocument } from 'src/shared/schemas/product.schema';
import { PaymentStatus } from 'src/shared/schemas/payment.schema';
import { NotificationsProducerService } from '../notifications/notifications.producer.service';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import {
  Order,
  OrderDocument,
  // OrderDocument,
  OrderStatus,
} from './schemas/orders.schema';

export interface CreateOrderDto {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly notificationsProducer: NotificationsProducerService,
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

  /**
   * Crée une nouvelle commande avec gestion atomique des stocks
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const session: ClientSession = await this.orderModel.db.startSession();

    try {
      session.startTransaction();

      // 1. Validation et récupération des produits
      const orderItems: any[] = [];
      let subtotalAmount = 0;

      for (const item of createOrderDto.items) {
        if (!Types.ObjectId.isValid(item.productId)) {
          throw new BadRequestException(
            `ID de produit invalide: ${item.productId}`,
          );
        }

        const product = await this.productModel
          .findById(item.productId)
          .session(session)
          .exec();

        if (!product) {
          throw new NotFoundException(`Produit non trouvé: ${item.productId}`);
        }

        const productData = product as any;

        // Vérification du stock
        if (productData.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuffisant pour le produit ${productData.name?.fr || productData.sku}. Stock disponible: ${productData.stock}`,
          );
        }

        // Calcul du prix total pour cet item
        const unitPrice = productData.price?.amount || 0;
        const totalPrice = unitPrice * item.quantity;
        subtotalAmount += totalPrice;

        orderItems.push({
          product: new Types.ObjectId(item.productId),
          sku: productData.sku,
          name: productData.name || { fr: '', en: '' },
          quantity: item.quantity,
          unitPrice: {
            amount: unitPrice,
            currency: 'XOF',
          },
          totalPrice: {
            amount: totalPrice,
            currency: 'XOF',
          },
          selectedVariants: item.selectedVariants || {},
        });
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
        user: new Types.ObjectId(createOrderDto.userId),
        items: orderItems,
        subtotal: { amount: subtotalAmount, currency: 'XOF' },
        shippingCost,
        taxAmount,
        discountAmount,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: createOrderDto.paymentMethod,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress:
          createOrderDto.billingAddress || createOrderDto.shippingAddress,
        notes: createOrderDto.notes,
        statusHistory: [
          {
            message: 'Commande créée',
            timestamp: new Date(),
          },
        ],
      };

      const createdOrder = new this.orderModel(orderData);
      const savedOrder = await createdOrder.save({ session });

      // 4. Décrémentation atomique des stocks
      for (const item of createOrderDto.items) {
        await this.productModel
          .findByIdAndUpdate(
            item.productId,
            {
              $inc: { stock: -item.quantity },
              $set: { updatedAt: new Date() },
            },
            { session, new: true },
          )
          .exec();
      }

      // 5. Validation finale - vérifier qu'aucun stock n'est devenu négatif
      for (const item of createOrderDto.items) {
        const updatedProduct = await this.productModel
          .findById(item.productId)
          .session(session)
          .exec();

        if (updatedProduct && (updatedProduct as any).stock < 0) {
          throw new BadRequestException(
            `Transaction annulée: stock insuffisant pour ${(updatedProduct as any).sku}`,
          );
        }
      }

      // 6. Commit de la transaction
      await session.commitTransaction();

      console.log(`✅ Commande ${savedOrder.orderNumber} créée avec succès`);

      // 7. Ajouter à la queue de notifications (implémenté à l'étape 8)
      await this.sendOrderCreatedNotification(savedOrder);

      return savedOrder;

      return savedOrder;
    } catch (error) {
      // Rollback en cas d'erreur
      await session.abortTransaction();
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
    } finally {
      await session.endSession();
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
        .find({ user: new Types.ObjectId(userId) })
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
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
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

    return updatedOrder!;
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

    const session: ClientSession = await this.orderModel.db.startSession();

    try {
      session.startTransaction();

      const order = await this.orderModel
        .findById(orderId)
        .session(session)
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
            { session },
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
          { new: true, session },
        )
        .exec();

      await session.commitTransaction();

      console.log(`✅ Commande ${orderData.orderNumber} annulée avec succès`);

      // Envoyer la notification d'annulation
      await this.sendOrderCancelledNotification(
        updatedOrder as OrderDocument,
        reason,
      );

      return updatedOrder!;
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Erreur lors de l'annulation de la commande:", error);
      throw error;
    } finally {
      await session.endSession();
    }
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
      //       fullName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
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

      const userData = (populatedOrder as any).user;

      await this.notificationsProducer.sendOrderCancelledNotification(
        {
          orderId: order._id as any,
          orderNumber: orderData.orderNumber,
          userId: userData._id,
          userEmail: userData.email || orderData.shippingAddress.email,
          status: OrderStatus.CANCELLED,
        },
        'fr',
      );
    } catch (error) {
      const err = error as Error;
      console.error(
        `❌ Erreur lors de l'envoi de la notification d'annulation: ${err.message}`,
      );
      // Ne pas bloquer le processus d'annulation si la notification échoue
    }
  }
}
