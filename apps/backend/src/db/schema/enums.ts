import { pgEnum } from "drizzle-orm/pg-core";
import {
	ACTIVATION_STATUSES,
	BANNER_PLACEMENTS,
	CART_STATUSES,
	CONTACT_MESSAGE_STATUSES,
	CONTENT_STATUSES,
	CURRENCY_CODES,
	FEATURED_KINDS,
	FULFILLMENT_STATUSES,
	INTEGRATION_ENVIRONMENTS,
	ORDER_STATUSES,
	PAYMENT_STATUSES,
	PRODUCT_KINDS,
	RESERVATION_STATUSES,
	SHIPPING_RATE_KINDS,
	STOCK_MOVEMENT_DIRECTIONS,
	STOCK_MOVEMENT_REASONS,
	TRANSACTION_KINDS,
	TRANSACTION_STATUSES,
	USER_KINDS,
	USER_STATUSES,
} from "@prettyfull/contracts";

/**
 * Types énumérés Postgres, dérivés des tuples de `@prettyfull/contracts`.
 *
 * Ajouter une valeur se fait donc dans les contrats : la base, la validation
 * et le typage restent alignés par construction. Attention : Postgres ne sait
 * pas retirer une valeur d'un enum — une suppression demande une migration
 * manuelle.
 */
export const userKindEnum = pgEnum("user_kind", USER_KINDS);
export const userStatusEnum = pgEnum("user_status", USER_STATUSES);
export const contentStatusEnum = pgEnum("content_status", CONTENT_STATUSES);
export const activationStatusEnum = pgEnum("activation_status", ACTIVATION_STATUSES);
export const productKindEnum = pgEnum("product_kind", PRODUCT_KINDS);
export const currencyEnum = pgEnum("currency_code", CURRENCY_CODES);
export const orderStatusEnum = pgEnum("order_status", ORDER_STATUSES);
export const paymentStatusEnum = pgEnum("payment_status", PAYMENT_STATUSES);
export const fulfillmentStatusEnum = pgEnum("fulfillment_status", FULFILLMENT_STATUSES);
export const cartStatusEnum = pgEnum("cart_status", CART_STATUSES);
export const stockMovementReasonEnum = pgEnum(
	"stock_movement_reason",
	STOCK_MOVEMENT_REASONS,
);
export const stockMovementDirectionEnum = pgEnum(
	"stock_movement_direction",
	STOCK_MOVEMENT_DIRECTIONS,
);
export const reservationStatusEnum = pgEnum("reservation_status", RESERVATION_STATUSES);
export const transactionKindEnum = pgEnum("transaction_kind", TRANSACTION_KINDS);
export const transactionStatusEnum = pgEnum("transaction_status", TRANSACTION_STATUSES);
export const integrationEnvironmentEnum = pgEnum(
	"integration_environment",
	INTEGRATION_ENVIRONMENTS,
);
export const shippingRateKindEnum = pgEnum("shipping_rate_kind", SHIPPING_RATE_KINDS);
export const bannerPlacementEnum = pgEnum("banner_placement", BANNER_PLACEMENTS);
export const featuredKindEnum = pgEnum("featured_kind", FEATURED_KINDS);
export const contactMessageStatusEnum = pgEnum(
	"contact_message_status",
	CONTACT_MESSAGE_STATUSES,
);
