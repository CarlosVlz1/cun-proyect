import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import {
  mockUser,
  mockUserDocument,
  mockUserWithoutPassword,
  mockRegisterDto,
} from '../__fixtures__/user.fixture';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'jwt.expiresIn') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('debería validar usuario correctamente con email', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(mockUserDocument as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      usersService.updateLastLogin.mockResolvedValue(undefined);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(usersService.updateLastLogin).toHaveBeenCalled();
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('debería validar usuario correctamente con username', async () => {
      const username = 'testuser';
      const password = 'password123';

      usersService.findByUsername.mockResolvedValue(mockUserDocument as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      usersService.updateLastLogin.mockResolvedValue(undefined);

      const result = await service.validateUser(username, password);

      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('debería retornar null si el usuario no existe', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería retornar null si la contraseña es incorrecta', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersService.findByEmail.mockResolvedValue(mockUserDocument as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(usersService.updateLastLogin).not.toHaveBeenCalled();
    });

    it('debería manejar errores y retornar null', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmail.mockRejectedValue(new Error('Database error'));

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('debería generar un token JWT y retornar información del usuario', async () => {
      const user = mockUserWithoutPassword;
      const mockToken = 'mock-jwt-token';

      jwtService.sign.mockReturnValue(mockToken);
      configService.get.mockReturnValue('7d');

      const result = await service.login(user as any);

      const userWithId = user as any;
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userWithId._id || userWithId.id,
        username: user.username,
        email: user.email,
      });
      expect(result).toEqual({
        accessToken: mockToken,
        tokenType: 'Bearer',
        expiresIn: '7d',
        user: {
          id: userWithId._id || userWithId.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          preferences: user.preferences,
        },
      });
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const newUser = { ...mockUser, id: 'new-id' };

      usersService.create.mockResolvedValue(newUser as any);

      const result = await service.register(mockRegisterDto);

      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(newUser);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token válido', async () => {
      const token = 'valid-token';
      const decoded = { sub: 'user-id', username: 'testuser' };

      jwtService.verify.mockReturnValue(decoded as any);

      const result = await service.verifyToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(decoded);
    });

    it('debería lanzar UnauthorizedException si el token es inválido', async () => {
      const token = 'invalid-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('debería generar un nuevo token para el usuario', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockToken = 'new-jwt-token';

      usersService.findById.mockResolvedValue(mockUserWithoutPassword as any);
      jwtService.sign.mockReturnValue(mockToken);
      configService.get.mockReturnValue('7d');

      const result = await service.refreshToken(userId);

      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: mockToken,
        tokenType: 'Bearer',
        expiresIn: '7d',
      });
    });
  });
});

