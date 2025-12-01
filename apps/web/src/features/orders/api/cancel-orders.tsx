import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const cancelOrder = async (orderId: string) => {
  const res = await apiClient.post(API_ROUTES.orders.cancel(orderId));
  return res.data;
};

export const useCancelOrder = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess,
    onError,
  });
};
