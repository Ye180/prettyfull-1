/**
 * ============================================================================
 * NOTIFICATION QUEUES - BullMQ
 * ============================================================================
 */
export enum NotificationQueue {
  ORDER_CONFIRMATION = 'order-confirmation-client',
  NEW_ORDER_ADMIN = 'new-order-admin',
  ORDER_SHIPMENT = 'order-shipment-code',
}

export enum NotificationJobName {
  SEND_ORDER_CONFIRMATION = 'send-order-confirmation',
  SEND_NEW_ORDER_NOTIFICATION = 'send-new-order-notification',
  SEND_SHIPMENT_CODE = 'send-shipment-code',
}

export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  WELCOME_EMAIL = 'welcome_email',
  PASSWORD_RESET = 'password_reset',
}

export interface OrderCreatedPayload {
  orderId: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  total: { amount: number; currency: string };
  items: Array<{
    name: string;
    quantity: number;
    price: { amount: number; currency: string };
  }>;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    country: string;
  };
}

export interface OrderStatusPayload {
  orderId: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: string;
  trackingNumber?: string;
}

export interface WelcomeEmailPayload {
  userId: string;
  userEmail: string;
  userName: string;
}

export interface PasswordResetPayload {
  userId: string;
  userEmail: string;
  resetToken: string;
  resetLink: string;
}

/**
 * ============================================================================
 * NEW BULLMQ INTERFACES
 * ============================================================================
 */

/**
 * Order Confirmation Email (Client)
 */
export interface OrderConfirmationData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: { amount: number; currency: string };
    image?: string;
  }>;
  subtotal: { amount: number; currency: string };
  shipping: { amount: number; currency: string };
  total: { amount: number; currency: string };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  language: 'fr' | 'en';
}

/**
 * New Order Notification (Admin)
 */
export interface NewOrderAdminData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderDate: Date;
  totalAmount: { amount: number; currency: string };
  itemsCount: number;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
  adminEmails: string[];
}

/**
 * Shipment Code Email (Client)
 */
export interface OrderShipmentData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  trackingCode: string;
  carrier: string;
  estimatedDelivery?: Date;
  trackingUrl?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  language: 'fr' | 'en';
}

/**
 * Generic Email Data
 */
export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Job Result
 */
export interface NotificationJobResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

/**
 * ============================================================================
 * LEGACY TYPES (keep for backward compatibility)
 * ============================================================================
 */
export type NotificationPayload =
  | OrderCreatedPayload
  | OrderStatusPayload
  | WelcomeEmailPayload
  | PasswordResetPayload;

export interface NotificationJob {
  type: NotificationType;
  payload: NotificationPayload;
  metadata?: {
    language?: string;
    retryCount?: number;
    priority?: number;
  };
}
