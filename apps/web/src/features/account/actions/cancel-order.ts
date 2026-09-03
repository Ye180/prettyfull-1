"use server";

import { getOrderById } from "@/lib/fake-data";

export async function cancelOrder(
	orderId: string,
): Promise<{ success: boolean; error?: string }> {
	const order = getOrderById(orderId);
	if (!order) {
		return { success: false, error: "Order not found" };
	}
	order.status = "canceled";
	return { success: true };
}
