import { User } from '../../users/schemas/user.schema';
import { Types } from 'mongoose';

/**
 * Fixtures para pruebas del módulo de autenticación
 */
export const mockUser: Partial<User> & { _id?: Types.ObjectId; id?: string } = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
  id: '507f1f77bcf86cd799439011',
  username: 'testuser',
  email: 'test@example.com',
  password: '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', // hashed 'password123'
  fullName: 'Test User',
  isActive: true,
  preferences: {
    theme: 'light',
    language: 'es',
    notifications: true,
    dateFormat: 'dd/MM/yyyy',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
};

export const mockUserDocument = {
  ...mockUser,
  toObject: jest.fn(() => ({
    ...mockUser,
    password: undefined,
  })),
  save: jest.fn(),
};

export const mockUserWithoutPassword = {
  ...mockUser,
  password: undefined,
};

export const mockRegisterDto = {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'Password123',
  fullName: 'New User',
  avatar: '',
};

export const mockLoginDto = {
  usernameOrEmail: 'testuser',
  password: 'password123',
};

