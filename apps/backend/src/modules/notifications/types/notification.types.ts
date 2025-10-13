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
