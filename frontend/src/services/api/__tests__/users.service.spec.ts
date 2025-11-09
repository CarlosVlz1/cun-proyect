import axiosInstance from '@/lib/axios';
import { usersService } from '../users.service';
import { mockUser } from '../__fixtures__/auth.fixture';

// Mock axiosInstance
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('usersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('debería obtener el perfil del usuario actual', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockUser });

      const result = await usersService.getProfile();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('debería manejar errores al obtener el perfil', async () => {
      const error = new Error('Unauthorized');
      mockedAxiosInstance.get.mockRejectedValue(error);

      await expect(usersService.getProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('debería actualizar el perfil del usuario', async () => {
      const updateData = { fullName: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateData };
      mockedAxiosInstance.patch.mockResolvedValue({ data: updatedUser });

      const result = await usersService.updateProfile(updateData);

      expect(mockedAxiosInstance.patch).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updatePassword', () => {
    it('debería cambiar la contraseña del usuario', async () => {
      const currentPassword = 'oldPassword123';
      const newPassword = 'newPassword123';
      mockedAxiosInstance.patch.mockResolvedValue({ data: {} });

      await usersService.updatePassword(currentPassword, newPassword);

      expect(mockedAxiosInstance.patch).toHaveBeenCalledWith('/users/me/password', {
        currentPassword,
        newPassword,
      });
    });
  });

  describe('deleteAccount', () => {
    it('debería desactivar la cuenta del usuario', async () => {
      mockedAxiosInstance.delete.mockResolvedValue({ data: {} });

      await usersService.deleteAccount();

      expect(mockedAxiosInstance.delete).toHaveBeenCalledWith('/users/me');
    });
  });
});

