"use server";

export async function cancelOrder(
	orderId: string,
): Promise<{ success: boolean; error?: string }> {
	const adminToken = process.env.MEDUSA_ADMIN_TOKEN;
	const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

	if (!adminToken) {
		return { success: false, error: "Service unavailable (admin token missing)" };
	}

	try {
		const res = await fetch(`${backendUrl}/admin/orders/${orderId}/cancel`, {
			method: "POST",
			headers: {
				"x-medusa-access-token": adminToken,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			return {
				success: false,
				error: (data as any).message || "Cancellation failed",
			};
		}

		return { success: true };
	} catch (err: any) {
		return { success: false, error: err.message };
	}
}
