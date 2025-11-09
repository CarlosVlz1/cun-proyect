import axiosInstance from '@/lib/axios';
import { statisticsService } from '../statistics.service';
import {
  mockGeneralStats,
  mockPriorityStats,
  mockProductivityData,
} from '../__fixtures__/statistics.fixture';

// Mock axiosInstance
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('statisticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGeneralStats', () => {
    it('debería obtener estadísticas generales', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockGeneralStats });

      const result = await statisticsService.getGeneralStats();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/statistics/general');
      expect(result).toEqual(mockGeneralStats);
    });

    it('debería manejar errores al obtener estadísticas', async () => {
      const error = new Error('Server error');
      mockedAxiosInstance.get.mockRejectedValue(error);

      await expect(statisticsService.getGeneralStats()).rejects.toThrow('Server error');
    });
  });

  describe('getByPriority', () => {
    it('debería obtener estadísticas por prioridad', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockPriorityStats });

      const result = await statisticsService.getByPriority();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/statistics/by-priority');
      expect(result).toEqual(mockPriorityStats);
    });
  });

  describe('getWeeklyProductivity', () => {
    it('debería obtener productividad semanal', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockProductivityData });

      const result = await statisticsService.getWeeklyProductivity();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/statistics/weekly-productivity');
      expect(result).toEqual(mockProductivityData);
    });
  });

  describe('getMonthlyProductivity', () => {
    it('debería obtener productividad mensual', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockProductivityData });

      const result = await statisticsService.getMonthlyProductivity();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/statistics/monthly-productivity');
      expect(result).toEqual(mockProductivityData);
    });
  });
});

