import axiosInstance from '@/lib/axios';
import { User } from '@/types';

/**
 * Servicio de usuarios
 * ISO 25010: Funcionalidad, Seguridad
 */

export const usersService = {
  /**
   * Obtiene el perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<User>('/users/me');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario actual
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.patch<User>('/users/me', data);
    return response.data;
  },

  /**
   * Cambia la contraseña del usuario actual
   */
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await axiosInstance.patch('/users/me/password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Desactiva la cuenta del usuario actual
   */
  async deleteAccount(): Promise<void> {
    await axiosInstance.delete('/users/me');
  },
};

