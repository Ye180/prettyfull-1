import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";
import { UpdateUserDto, User } from "../types";

export const updateUser = async ({
	userId,
	data,
}: {
	userId: string;
	data: UpdateUserDto;
}): Promise<User> => {
	const response = await apiClient.put(API_ROUTES.users.update(userId), data);
	return response.data;
};

export const useUpdateUser = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: updateUser,
		onSuccess,
		onError,
	});
};
