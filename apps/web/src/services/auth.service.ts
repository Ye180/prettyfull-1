// web/src/services/auth.service.ts
import apiClient from '@/api/client';
import { API_ROUTES } from '@/api';
import { setItem } from '@/lib/utils/local-storage';
import { LoginDto } from '@/features/auth/types/login.dto';
import { AuthResponse, User } from '@/features/auth/types';
import { RegisterDto } from '@/features/auth/types/register.dto';




export const authService = {
  /**
   * Connecte un utilisateur.
   * @param credentials - L'email et le mot de passe de l'utilisateur.
   * @returns Une promesse qui résout avec la réponse d'authentification (token + user).
   */
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.auth.login, credentials);
    
    if (response.data.accessToken) {
      setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  },

  /**
   * Crée un nouveau compte utilisateur.
   * @param userData - Les informations du nouvel utilisateur.
   * @returns Une promesse qui résout avec la réponse d'authentification.
   */
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.auth.register, userData);
    
    if (response.data.accessToken) {
      setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  },

  /**
   * Récupère les informations de l'utilisateur connecté via son token.
   * @returns Une promesse qui résout avec les données de l'utilisateur.
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ROUTES.auth.getProfile);
    return response.data;
  },
  
  /**
   * Déconnecte l'utilisateur en supprimant le token.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
  }
};