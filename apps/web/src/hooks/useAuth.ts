// web/src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
// 1. Importer la constante spécifique au lieu de 'queryKeys'
import { USER_QUERY_KEY } from '@/shared/utils/query-keys'; 

// 2. Définir la clé de query pour React Query (c'est un tableau)
const AUTH_USER_KEY_ARRAY = [USER_QUERY_KEY];

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // data contient { user, accessToken, refreshToken }
      // 3. Utiliser la bonne clé de query
      queryClient.setQueryData(AUTH_USER_KEY_ARRAY, data.user);
      
      // La redirection est gérée par le service (qui set les cookies)
      // router.push('/'); // Redirection déjà gérée par le formulaire de login
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
      // 3. Utiliser la bonne clé de query
      queryClient.setQueryData(AUTH_USER_KEY_ARRAY, data.user);
      // router.push('/'); // Redirection gérée par le formulaire
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    // 3. Utiliser la bonne clé de query
    queryKey: AUTH_USER_KEY_ARRAY,
    queryFn: authService.getProfile,
    retry: false, // Ne pas réessayer si 401
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
    staleTime: 1000 * 60 * 5, // Garder le profil "frais" pendant 5 minutes
  });
};

// --- HOOK MANQUANT ---
// Ce hook combine useGetProfile pour fournir un statut d'authentification simple
export const useAuth = () => {
  const { data: user, isLoading, isError, isSuccess, status } = useGetProfile();

  // L'utilisateur est authentifié si la requête a réussi (isSuccess)
  // et que 'user' n'est pas null/undefined.
  const isAuthenticated = isSuccess && !!user;

  return {
    user, // L'objet utilisateur ou undefined
    isLoading, // (true) si la requête 'getProfile' est en cours
    isError, // (true) si 'getProfile' a échoué (ex: 401)
    isAuthenticated, // (true) si 'getProfile' a réussi
    status, // 'pending', 'success', 'error'
  };
};
// --- FIN DE L'AJOUT ---