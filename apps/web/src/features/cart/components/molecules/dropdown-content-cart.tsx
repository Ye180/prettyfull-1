"use client";

import { Button, ScrollArea } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { useCartStore } from "../../../../../../../packages/store/src/use-cart-store";

const DropdownContentCart = () => {
	const t = useTranslations("cart");
	const router = useRouter();
	const { items } = useCartStore();
	const total = items.reduce(
		(acc, item) => acc + (item.unitPrice?.amount || 0) * item.quantity,
		0,
	);

	const subtotal = useMemo(() => {
		return items
			.reduce(
				(acc, item) =>
					acc + (item.unitPrice?.amount ?? 0) * (item.quantity ?? 0),
				0,
			)
			.toFixed(2);
	}, [items]); // ⬅️ 3. CRÉER LA MÊME LOGIQUE DE REDIRECTION SÉCURISÉE

	const handleCheckout = () => {
		router.push("/checkout");
	};
	const goToCart = () => {
		router.push("/cart");
	};

	return (
		<span className="absolute top-20 z-50 flex-col justify-center p-4 py-6 text-sm text-black bg-white rounded-md border border-gray-100 shadow-2xl -left-144 h-fit w-160 max-sm:hidden">
			{items.length === 0 ? (
				<div className="py-8 text-center">
					<h4 className="mb-4 text-[1.8rem]! font-semibold font-manrope">
						{t("empty")}
					</h4>
				</div>
			) : (
				<>
					<ScrollArea className="h-[200px] w-full pr-4">
						<div className="flex flex-col gap-4">
							{items.map((item) => (
								<div key={item.product.id} className="flex gap-4">
									<img
										src={item.product.image || "/assets/product_1.jpg"}
										alt={item.product.name}
										className="object-cover w-16 h-16"
									/>
									<div>
										<p className="font-semibold">{item.product.name}</p>
										<p>
											{item.quantity} x {item.unitPrice?.amount}{" "}
											{item.unitPrice?.currency}
										</p>
									</div>
								</div>
							))}
							           {" "}
						</div>
						         {" "}
					</ScrollArea>
					         {" "}
					<div className="pt-4 mt-4 w-full border-t">
						           {" "}
						<div className="flex justify-between font-semibold">
							              <p>{t("subtotal")}</p>             {" "}
							<p>${subtotal}</p>           {" "}
						</div>
						           {" "}
						<div className="flex flex-col gap-2 mt-4">
							              {/* 4. APPLIQUER LE HANDLER ET LE LOADING STATE */} 
							           {" "}
							<Button
								onClick={handleCheckout}
								className="w-full"
							>
								                {t("checkout")}             {" "}
							</Button>
							             {" "}
							<Button onClick={goToCart} variant="outline" className="w-full">
								                {t("viewCart")}             {" "}
							</Button>
							           {" "}
						</div>
						         {" "}
					</div>
					       {" "}
				</>
			)}
			         {" "}
		</span>
	);
};

export default DropdownContentCart;
