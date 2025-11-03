import axiosInstance from '@/lib/axios';
import { GeneralStats, PriorityStats, ProductivityData } from '@/types';

/**
 * Servicio de estadísticas
 * ISO 25010: Funcionalidad, Usabilidad
 */

export const statisticsService = {
  /**
   * Obtiene estadísticas generales
   */
  async getGeneralStats(): Promise<GeneralStats> {
    const response = await axiosInstance.get<GeneralStats>('/statistics/general');
    return response.data;
  },

  /**
   * Obtiene estadísticas por prioridad
   */
  async getByPriority(): Promise<PriorityStats> {
    const response = await axiosInstance.get<PriorityStats>('/statistics/by-priority');
    return response.data;
  },

  /**
   * Obtiene estadísticas por categoría
   */
  async getByCategory(): Promise<any[]> {
    const response = await axiosInstance.get<any[]>('/statistics/by-category');
    return response.data;
  },

  /**
   * Obtiene productividad semanal
   */
  async getWeeklyProductivity(): Promise<ProductivityData[]> {
    const response = await axiosInstance.get<ProductivityData[]>('/statistics/weekly-productivity');
    return response.data;
  },

  /**
   * Obtiene productividad mensual
   */
  async getMonthlyProductivity(): Promise<ProductivityData[]> {
    const response = await axiosInstance.get<ProductivityData[]>('/statistics/monthly-productivity');
    return response.data;
  },
};

