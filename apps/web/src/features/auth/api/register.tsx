
import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";
import { RegisterDto } from "../types/register.dto";
import { User } from "../../users/types"; 

export const register = async (data: RegisterDto): Promise<User> => {
	const response = await apiClient.post(API_ROUTES.auth.register, data);
	return response.data;
};

export const useRegister = () => {
	return useMutation({
		mutationFn: register,
        onSuccess: () => {
            //on doit ajouter une redirection vers login?
        }
	});
};