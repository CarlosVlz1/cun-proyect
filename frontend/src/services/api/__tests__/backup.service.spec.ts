import axiosInstance from '@/lib/axios';
import { backupService } from '../backup.service';
import { mockExportData, mockImportResult } from '../__fixtures__/backup.fixture';

// Mock axiosInstance
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock window methods
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
global.Blob = jest.fn((content) => ({ content })) as any;

describe('backupService', () => {
  const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document methods (solo si document está disponible)
    if (typeof document !== 'undefined') {
      document.createElement = jest.fn(() => ({
        href: '',
        download: '',
        click: jest.fn(),
      })) as any;
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    }
  });

  describe('exportData', () => {
    it('debería exportar todos los datos', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockExportData });

      const result = await backupService.exportData();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/backup/export');
      expect(result).toEqual(mockExportData);
    });
  });

  describe('importData', () => {
    it('debería importar datos desde un backup', async () => {
      mockedAxiosInstance.post.mockResolvedValue({ data: mockImportResult });

      const result = await backupService.importData(mockExportData);

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/backup/import', mockExportData);
      expect(result).toEqual(mockImportResult);
    });
  });

  describe('createBackup', () => {
    it('debería crear un backup', async () => {
      mockedAxiosInstance.post.mockResolvedValue({ data: mockExportData });

      const result = await backupService.createBackup();

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/backup/create');
      expect(result).toEqual(mockExportData);
    });
  });

  describe('restoreBackup', () => {
    it('debería restaurar desde un backup', async () => {
      mockedAxiosInstance.post.mockResolvedValue({ data: mockImportResult });

      const result = await backupService.restoreBackup(mockExportData);

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/backup/restore', mockExportData);
      expect(result).toEqual(mockImportResult);
    });
  });

  describe('deleteAllData', () => {
    it('debería eliminar todos los datos', async () => {
      mockedAxiosInstance.delete.mockResolvedValue({ data: {} });

      await backupService.deleteAllData();

      expect(mockedAxiosInstance.delete).toHaveBeenCalledWith('/backup/delete-all');
    });
  });

  describe('downloadBackup', () => {
    it('debería descargar los datos como archivo JSON', async () => {
      // Este test requiere jsdom, saltarlo en entorno node
      if (typeof document === 'undefined') {
        return;
      }

      mockedAxiosInstance.get.mockResolvedValue({ data: mockExportData });
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      (document.createElement as jest.Mock).mockReturnValue(mockLink);

      await backupService.downloadBackup();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/backup/export');
      expect(global.Blob).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});

