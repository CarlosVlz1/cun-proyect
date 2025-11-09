import axios from 'axios';
import axiosInstance from '../axios';
import { getSession, signOut } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
  signOut: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe('axiosInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('request interceptor', () => {
    it('debería agregar el token de autorización si hay sesión', async () => {
      const mockSession = {
        accessToken: 'mock-token',
        user: { id: '1', name: 'Test' },
      };
      mockedGetSession.mockResolvedValue(mockSession as any);

      const config = {
        headers: {} as any,
      };

      // Simular el interceptor
      const interceptor = axiosInstance.interceptors.request.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = await interceptor.fulfilled(config as any);
        expect(mockedGetSession).toHaveBeenCalled();
        expect(result.headers.Authorization).toBe('Bearer mock-token');
      }
    });

    it('no debería agregar token si no hay sesión', async () => {
      mockedGetSession.mockResolvedValue(null);

      const config = {
        headers: {} as any,
      };

      const interceptor = axiosInstance.interceptors.request.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = await interceptor.fulfilled(config as any);
        expect(result.headers.Authorization).toBeUndefined();
      }
    });

    it('debería manejar errores en el interceptor de request', async () => {
      const error = new Error('Request error');
      const interceptor = axiosInstance.interceptors.request.handlers[0];
      if (interceptor && interceptor.rejected) {
        const result = interceptor.rejected(error);
        await expect(result).rejects.toThrow('Request error');
      }
    });
  });

  describe('response interceptor', () => {
    it('debería retornar la respuesta exitosa sin modificar', () => {
      const response = { data: { success: true }, status: 200 };
      const interceptor = axiosInstance.interceptors.response.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(response as any);
        expect(result).toEqual(response);
      }
    });

    it('debería cerrar sesión si recibe un error 401', async () => {
      const error = {
        response: { status: 401 },
      };
      mockedSignOut.mockResolvedValue(undefined);

      const interceptor = axiosInstance.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error as any);
        } catch (e) {
          // Expected to throw
        }
        expect(mockedSignOut).toHaveBeenCalledWith({
          redirect: true,
          callbackUrl: '/login',
        });
      }
    });

    it('debería rechazar el error si no es 401', async () => {
      const error = {
        response: { status: 500 },
      };

      const interceptor = axiosInstance.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        const result = interceptor.rejected(error as any);
        await expect(result).rejects.toEqual(error);
        expect(mockedSignOut).not.toHaveBeenCalled();
      }
    });
  });
});

