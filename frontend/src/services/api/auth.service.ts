import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Servicio de autenticación
 * ISO 25010: Funcionalidad, Seguridad
 */

export const authService = {
  /**
   * Inicia sesión con credenciales
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterData): Promise<{ message: string; user: any }> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  /**
   * Refresca el token JWT
   */
  async refreshToken(token: string): Promise<{ accessToken: string; tokenType: string; expiresIn: string }> {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Verifica si un token es válido
   */
  async verifyToken(token: string): Promise<{ valid: boolean; user: any }> {
    const response = await axios.post(
      `${API_URL}/auth/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Cierra sesión
   */
  async logout(token: string): Promise<void> {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

