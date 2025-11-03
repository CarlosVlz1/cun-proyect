import axiosInstance from '@/lib/axios';
import { ExportData, ImportResult } from '@/types';

/**
 * Servicio de backup y export/import
 * ISO 25010: Portabilidad, Fiabilidad
 */

export const backupService = {
  /**
   * Exporta todos los datos
   */
  async exportData(): Promise<ExportData> {
    const response = await axiosInstance.get<ExportData>('/backup/export');
    return response.data;
  },

  /**
   * Importa datos desde un backup
   */
  async importData(data: ExportData): Promise<ImportResult> {
    const response = await axiosInstance.post<ImportResult>('/backup/import', data);
    return response.data;
  },

  /**
   * Crea un backup
   */
  async createBackup(): Promise<ExportData> {
    const response = await axiosInstance.post<ExportData>('/backup/create');
    return response.data;
  },

  /**
   * Restaura desde un backup
   */
  async restoreBackup(data: ExportData): Promise<ImportResult> {
    const response = await axiosInstance.post<ImportResult>('/backup/restore', data);
    return response.data;
  },

  /**
   * Elimina todos los datos
   */
  async deleteAllData(): Promise<void> {
    await axiosInstance.delete('/backup/delete-all');
  },

  /**
   * Descarga los datos como archivo JSON
   */
  async downloadBackup(): Promise<void> {
    const data = await this.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

