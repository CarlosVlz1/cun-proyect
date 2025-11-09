import axios from 'axios';
import { authService } from '../auth.service';
import {
  mockLoginCredentials,
  mockRegisterData,
  mockAuthResponse,
  mockRefreshTokenResponse,
  mockVerifyTokenResponse,
} from '../__fixtures__/auth.fixture';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockAuthResponse });

      const result = await authService.login(mockLoginCredentials);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        mockLoginCredentials,
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('debería manejar errores de login', async () => {
      const error = new Error('Invalid credentials');
      mockedAxios.post.mockRejectedValue(error);

      await expect(authService.login(mockLoginCredentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const registerResponse = { message: 'Usuario registrado exitosamente', user: mockAuthResponse.user };
      mockedAxios.post.mockResolvedValue({ data: registerResponse });

      const result = await authService.register(mockRegisterData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        mockRegisterData,
      );
      expect(result).toEqual(registerResponse);
    });

    it('debería manejar errores de registro', async () => {
      const error = new Error('Email already exists');
      mockedAxios.post.mockRejectedValue(error);

      await expect(authService.register(mockRegisterData)).rejects.toThrow('Email already exists');
    });
  });

  describe('refreshToken', () => {
    it('debería refrescar el token correctamente', async () => {
      const token = 'old-token';
      mockedAxios.post.mockResolvedValue({ data: mockRefreshTokenResponse });

      const result = await authService.refreshToken(token);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      expect(result).toEqual(mockRefreshTokenResponse);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token válido', async () => {
      const token = 'valid-token';
      mockedAxios.post.mockResolvedValue({ data: mockVerifyTokenResponse });

      const result = await authService.verifyToken(token);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/verify'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      expect(result).toEqual(mockVerifyTokenResponse);
    });
  });

  describe('logout', () => {
    it('debería cerrar sesión correctamente', async () => {
      const token = 'valid-token';
      mockedAxios.post.mockResolvedValue({ data: {} });

      await authService.logout(token);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    });
  });
});

