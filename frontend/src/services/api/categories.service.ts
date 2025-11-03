import axiosInstance from '@/lib/axios';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/types';

/**
 * Servicio de categorías
 * ISO 25010: Funcionalidad
 */

export const categoriesService = {
  /**
   * Obtiene todas las categorías
   */
  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Obtiene una categoría por ID
   */
  async getCategory(id: string): Promise<Category> {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva categoría
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await axiosInstance.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Actualiza una categoría
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await axiosInstance.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una categoría
   */
  async deleteCategory(id: string): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  },

  /**
   * Obtiene el conteo de tareas por categoría
   */
  async getTaskCounts(): Promise<Record<string, number>> {
    const response = await axiosInstance.get<Record<string, number>>('/categories/task-counts');
    return response.data;
  },
};

