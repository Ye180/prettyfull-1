import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * ============================================================================
 * ORDER EVENTS SERVICE - Server-Sent Events (SSE)
 * ============================================================================
 * Gère les connexions SSE et broadcast les événements de commande en temps réel
 */

export interface OrderStatusEvent {
  orderId: string;
  status: string;
  timestamp: Date;
  message: string;
  metadata?: Record<string, any>;
}

export interface NewOrderAdminEvent {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: { amount: number; currency: string };
  timestamp: Date;
}

@Injectable()
export class OrderEventsService {
  private readonly logger = new Logger(OrderEventsService.name);

  // Subject pour tous les événements de commande
  private orderStatusUpdates$ = new Subject<OrderStatusEvent>();
  
  // Subject pour les notifications admin de nouvelles commandes
  private newOrderNotifications$ = new Subject<NewOrderAdminEvent>();

  /**
   * Émettre un événement de changement de statut pour une commande
   */
  emitOrderStatusUpdate(event: OrderStatusEvent): void {
    this.logger.log(
      `📡 Broadcasting status update for order ${event.orderId}: ${event.status}`,
    );
    this.orderStatusUpdates$.next(event);
  }

  /**
   * Émettre une notification de nouvelle commande pour les admins
   */
  emitNewOrderNotification(event: NewOrderAdminEvent): void {
    this.logger.log(
      `📡 Broadcasting new order notification: ${event.orderNumber}`,
    );
    this.newOrderNotifications$.next(event);
  }

  /**
   * S'abonner aux événements d'une commande spécifique (pour SSE client)
   */
  subscribeToOrder(orderId: string): Observable<OrderStatusEvent> {
    this.logger.log(`📺 Client subscribed to order ${orderId}`);
    
    return this.orderStatusUpdates$.pipe(
      filter((event) => event.orderId === orderId),
      map((event) => {
        this.logger.debug(
          `📤 Sending event to client for order ${orderId}: ${event.status}`,
        );
        return event;
      }),
    );
  }

  /**
   * S'abonner aux notifications de nouvelles commandes (pour SSE admin)
   */
  subscribeToNewOrders(): Observable<NewOrderAdminEvent> {
    this.logger.log(`📺 Admin subscribed to new order notifications`);
    
    return this.newOrderNotifications$;
  }

  /**
   * Obtenir le nombre d'abonnés actifs (pour monitoring)
   */
  getActiveSubscribersCount(): {
    orderUpdates: number;
    newOrders: number;
  } {
    return {
      orderUpdates: this.orderStatusUpdates$.observers.length,
      newOrders: this.newOrderNotifications$.observers.length,
    };
  }
}
