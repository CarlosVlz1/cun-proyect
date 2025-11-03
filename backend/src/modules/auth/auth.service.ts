import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * Valida las credenciales del usuario
   * ISO 25010: Seguridad, Funcionalidad
   */
  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    try {
      // Buscar por email o username
      let user;
      if (usernameOrEmail.includes('@')) {
        user = await this.usersService.findByEmail(usernameOrEmail);
      } else {
        user = await this.usersService.findByUsername(usernameOrEmail);
      }

      if (!user) {
        return null;
      }

      // Verificar contraseña con bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      // Actualizar último login
      await this.usersService.updateLastLogin(user.id);

      // Retornar usuario sin password
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      this.logger.error(
        `Error validando usuario: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined
      );
      return null;
    }
  }

  /**
   * Genera un token JWT para el usuario
   * ISO 25010: Seguridad
   */
  async login(user: any) {
    const payload = {
      sub: user._id || user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('jwt.expiresIn');

    this.logger.log(`Usuario autenticado: ${user.username}`);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    };
  }

  /**
   * Registra un nuevo usuario
   * ISO 25010: Funcionalidad, Seguridad
   */
  async register(registerDto: RegisterDto): Promise<User> {
    this.logger.log(`Intentando registrar nuevo usuario: ${registerDto.username}`);
    return this.usersService.create(registerDto);
  }

  /**
   * Verifica si un token JWT es válido
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Refresca el token JWT
   * ISO 25010: Usabilidad, Seguridad
   */
  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);

    // Use _id or id from the document
    const userObject = user as any;
    const userIdForPayload = userObject._id?.toString() || userObject.id || userId;

    const payload = {
      sub: userIdForPayload,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('jwt.expiresIn');

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }
}
