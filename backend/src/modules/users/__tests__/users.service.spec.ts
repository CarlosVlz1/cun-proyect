import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { User, UserDocument } from '../schemas/user.schema';
import {
  mockUser,
  mockUserDocument,
  mockCreateUserDto,
  mockUpdateUserDto,
  mockUpdatePasswordDto,
  mockUserList,
} from '../__fixtures__/user.fixture';

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<UserDocument>>;

  beforeEach(async () => {
    const mockModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn(),
      new: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un nuevo usuario con contraseña hasheada', async () => {
      const hashedPassword = 'hashed-password';
      const savedUser = { 
        ...mockUser, 
        password: hashedPassword,
        id: mockUser.id,
        username: mockCreateUserDto.username,
      };
      const userInstance = {
        ...savedUser,
        save: jest.fn().mockResolvedValue(savedUser),
      };

      model.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      
      // Mock del constructor del modelo - debe tener los métodos del modelo también
      const MockUserModel = jest.fn().mockImplementation(() => userInstance) as any;
      // Agregar métodos del modelo al constructor
      MockUserModel.findOne = model.findOne;
      MockUserModel.findById = model.findById;
      MockUserModel.find = model.find;
      MockUserModel.findByIdAndUpdate = model.findByIdAndUpdate;
      MockUserModel.findByIdAndDelete = model.findByIdAndDelete;
      MockUserModel.countDocuments = model.countDocuments;
      
      (service as any).userModel = MockUserModel;
      
      // Mock findById que se llama al final con savedUser.id
      // También necesitamos mockearlo en MockUserModel
      const findByIdQuery = {
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      model.findById = jest.fn().mockReturnValue(findByIdQuery);
      MockUserModel.findById = model.findById;

      const result = await service.create(mockCreateUserDto);

      expect(model.findOne).toHaveBeenCalledWith({
        $or: [
          { email: mockCreateUserDto.email },
          { username: mockCreateUserDto.username },
        ],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserDto.password, 10);
      expect(MockUserModel).toHaveBeenCalled();
      expect(userInstance.save).toHaveBeenCalled();
      expect(model.findById).toHaveBeenCalledWith(savedUser.id);
      expect(result).toBeDefined();
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      model.findOne.mockResolvedValue({
        ...mockUser,
        email: mockCreateUserDto.email,
      } as any);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(ConflictException);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el username ya existe', async () => {
      model.findOne.mockResolvedValue({
        ...mockUser,
        username: mockCreateUserDto.username,
      } as any);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar BadRequestException si hay un error al crear el usuario', async () => {
      model.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
      
      const MockUserModel = jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      }) as any;
      MockUserModel.findOne = model.findOne;
      (service as any).userModel = MockUserModel;

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('debería encontrar un usuario por email', async () => {
      const email = 'test@example.com';
      const query = {
        findOne: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserDocument),
      };

      model.findOne = jest.fn().mockReturnValue(query);

      const result = await service.findByEmail(email);

      expect(model.findOne).toHaveBeenCalledWith({ email, isActive: true });
      expect(result).toEqual(mockUserDocument);
    });

    it('debería retornar null si el usuario no existe', async () => {
      const email = 'nonexistent@example.com';
      const query = {
        findOne: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      model.findOne = jest.fn().mockReturnValue(query);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('debería encontrar un usuario por username', async () => {
      const username = 'testuser';
      const query = {
        findOne: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserDocument),
      };

      model.findOne = jest.fn().mockReturnValue(query);

      const result = await service.findByUsername(username);

      expect(model.findOne).toHaveBeenCalledWith({ username, isActive: true });
      expect(result).toEqual(mockUserDocument);
    });
  });

  describe('findById', () => {
    it('debería encontrar un usuario por ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(id);

      expect(model.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const id = '507f1f77bcf86cd799439011';
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar lista paginada de usuarios', async () => {
      const page = 1;
      const limit = 10;
      const total = 2;

      const query = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserList),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      const result = await service.findAll(page, limit);

      expect(result).toEqual({
        users: mockUserList,
        total,
        pages: Math.ceil(total / limit),
      });
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(id, mockUpdateUserDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('debería actualizar preferencias cuando se proporcionan', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateWithPreferences = {
        theme: 'dark' as const,
        language: 'en' as const,
        notifications: false,
        dateFormat: 'MM/dd/yyyy',
      };
      const updatedUser = { ...mockUser, preferences: { ...mockUser.preferences, ...updateWithPreferences } };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(id, updateWithPreferences);

      expect(model.findById).toHaveBeenCalledWith(id);
      expect(result).toBeDefined();
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(id, mockUpdateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si hay un error al actualizar (no NotFoundException)', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.update(id, mockUpdateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar la contraseña si la actual es correcta', async () => {
      const id = '507f1f77bcf86cd799439011';
      const hashedNewPassword = 'new-hashed-password';

      model.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserDocument),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedNewPassword as never);
      model.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);

      await service.updatePassword(id, mockUpdatePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUpdatePasswordDto.currentPassword,
        mockUser.password,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUpdatePasswordDto.newPassword, 10);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        password: hashedNewPassword,
      });
    });

    it('debería lanzar BadRequestException si la contraseña actual es incorrecta', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserDocument),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.updatePassword(id, mockUpdatePasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updatePassword(id, mockUpdatePasswordDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateLastLogin', () => {
    it('debería actualizar el último login del usuario', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);

      await service.updateLastLogin(id);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        lastLogin: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('debería desactivar un usuario (soft delete)', async () => {
      const id = '507f1f77bcf86cd799439011';
      const deactivatedUser = { ...mockUser, isActive: false };

      model.findByIdAndUpdate = jest.fn().mockResolvedValue(deactivatedUser);

      await service.remove(id);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('hardDelete', () => {
    it('debería eliminar permanentemente un usuario', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      await service.hardDelete(id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const id = '507f1f77bcf86cd799439011';

      model.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(service.hardDelete(id)).rejects.toThrow(NotFoundException);
    });
  });
});

