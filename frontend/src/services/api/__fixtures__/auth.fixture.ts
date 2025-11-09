import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

/**
 * Fixtures para pruebas de servicios de autenticación
 */
export const mockUser: User = {
  id: '507f1f77bcf86cd799439011',
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  preferences: {
    theme: 'light',
    language: 'es',
    notifications: true,
    dateFormat: 'dd/MM/yyyy',
  },
  isActive: true,
  lastLogin: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-jwt-token',
  tokenType: 'Bearer',
  expiresIn: '7d',
  user: mockUser,
};

export const mockLoginCredentials: LoginCredentials = {
  usernameOrEmail: 'testuser',
  password: 'Password123',
};

export const mockRegisterData: RegisterData = {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'Password123',
  fullName: 'New User',
};

export const mockRefreshTokenResponse = {
  accessToken: 'new-mock-jwt-token',
  tokenType: 'Bearer',
  expiresIn: '7d',
};

export const mockVerifyTokenResponse = {
  valid: true,
  user: mockUser,
};

