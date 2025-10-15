// web/src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

const USER_QUERY_KEY = 'user';


export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data.user);
      
      router.push('/'); 
    },
    onError: (error) => {
      console.error("Erreur de connexion:", error);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data.user);
      router.push('/');
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: authService.getProfile,
    retry: false,
  });
};