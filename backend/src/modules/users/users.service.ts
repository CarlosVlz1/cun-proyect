import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Crea un nuevo usuario con contraseña hasheada
   * ISO 25010: Funcionalidad, Seguridad
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Verificar si el usuario o email ya existe
      const existingUser = await this.userModel.findOne({
        $or: [{ email: createUserDto.email }, { username: createUserDto.username }],
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('El correo electrónico ya está registrado');
        }
        if (existingUser.username === createUserDto.username) {
          throw new ConflictException('El nombre de usuario ya está en uso');
        }
      }

      // Hashear contraseña con bcrypt (10 rounds)
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save();
      this.logger.log(`Usuario creado exitosamente: ${savedUser.username}`);

      // Retornar sin password
      return this.findById(savedUser.id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error al crear usuario: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  /**
   * Encuentra un usuario por su email (incluye password para autenticación)
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isActive: true }).select('+password').exec();
  }

  /**
   * Encuentra un usuario por su username (incluye password para autenticación)
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username, isActive: true }).select('+password').exec();
  }

  /**
   * Encuentra un usuario por ID (sin password)
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Obtiene todos los usuarios (paginado)
   * ISO 25010: Eficiencia de Desempeño
   */
  async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments({ isActive: true }),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Actualiza un usuario
   * ISO 25010: Funcionalidad, Mantenibilidad
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // Si se actualizan preferencias, las manejamos apropiadamente
      const updateData: any = { ...updateUserDto };

      if (
        updateUserDto.theme ||
        updateUserDto.language ||
        updateUserDto.notifications ||
        updateUserDto.dateFormat
      ) {
        const user = await this.findById(id);
        updateData.preferences = {
          ...user.preferences,
          ...(updateUserDto.theme && { theme: updateUserDto.theme }),
          ...(updateUserDto.language && { language: updateUserDto.language }),
          ...(updateUserDto.notifications !== undefined && {
            notifications: updateUserDto.notifications,
          }),
          ...(updateUserDto.dateFormat && { dateFormat: updateUserDto.dateFormat }),
        };

        // Eliminar propiedades individuales
        delete updateData.theme;
        delete updateData.language;
        delete updateData.notifications;
        delete updateData.dateFormat;
      }

      const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      this.logger.log(`Usuario actualizado: ${user.username}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error al actualizar usuario: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  /**
   * Actualiza la contraseña de un usuario
   * ISO 25010: Seguridad
   */
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userModel.findById(id).select('+password').exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });

    this.logger.log(`Contraseña actualizada para usuario: ${user.username}`);
  }

  /**
   * Actualiza el último login del usuario
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  /**
   * Desactiva un usuario (soft delete)
   * ISO 25010: Fiabilidad, Mantenibilidad
   */
  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.log(`Usuario desactivado: ${user.username}`);
  }

  /**
   * Elimina permanentemente un usuario (hard delete)
   * Solo para casos extremos o requisitos legales
   */
  async hardDelete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.warn(`Usuario eliminado permanentemente: ${result.username}`);
  }
}
