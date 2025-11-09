import { User } from '../schemas/user.schema';
import { Types } from 'mongoose';

/**
 * Fixtures para pruebas del módulo de usuarios
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
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastLogin: new Date('2024-01-01'),
};

export const mockUserDocument = {
  ...mockUser,
  toObject: jest.fn(() => mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
};

export const mockCreateUserDto = {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'Password123',
  fullName: 'New User',
  avatar: '',
};

export const mockUpdateUserDto = {
  fullName: 'Updated Name',
  theme: 'dark' as const,
};

export const mockUpdatePasswordDto = {
  currentPassword: 'password123',
  newPassword: 'newpassword123',
};

export const mockUserList = [
  mockUser,
  {
    ...mockUser,
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    id: '507f1f77bcf86cd799439012',
    username: 'user2',
    email: 'user2@example.com',
  },
];

