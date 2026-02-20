"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.NotificationJobName = exports.NotificationQueue = void 0;
var NotificationQueue;
(function (NotificationQueue) {
    NotificationQueue["ORDER_CONFIRMATION"] = "order-confirmation-client";
    NotificationQueue["NEW_ORDER_ADMIN"] = "new-order-admin";
    NotificationQueue["ORDER_SHIPMENT"] = "order-shipment-code";
})(NotificationQueue || (exports.NotificationQueue = NotificationQueue = {}));
var NotificationJobName;
(function (NotificationJobName) {
    NotificationJobName["SEND_ORDER_CONFIRMATION"] = "send-order-confirmation";
    NotificationJobName["SEND_NEW_ORDER_NOTIFICATION"] = "send-new-order-notification";
    NotificationJobName["SEND_SHIPMENT_CODE"] = "send-shipment-code";
})(NotificationJobName || (exports.NotificationJobName = NotificationJobName = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["ORDER_CREATED"] = "order_created";
    NotificationType["ORDER_CONFIRMED"] = "order_confirmed";
    NotificationType["ORDER_SHIPPED"] = "order_shipped";
    NotificationType["ORDER_DELIVERED"] = "order_delivered";
    NotificationType["ORDER_CANCELLED"] = "order_cancelled";
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["WELCOME_EMAIL"] = "welcome_email";
    NotificationType["PASSWORD_RESET"] = "password_reset";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=notification.types.js.map