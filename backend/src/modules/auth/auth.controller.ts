import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

interface RequestWithUser extends Request {
  user: {
    userId?: string;
    _id?: string;
    id?: string;
    username: string;
    email: string;
    fullName?: string;
    avatar?: string;
    preferences?: any;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuario o email ya existe',
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    // Use _id or id from the document
    const userId = (user as any)._id?.toString() || (user as any).id;
    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 intentos por minuto
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna token JWT',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos de login',
  })
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refrescar token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async refreshToken(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.user.userId || req.user.id || req.user._id || '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'En una implementación con JWT stateless, el logout se maneja en el cliente. Este endpoint puede usarse para logging o invalidación de tokens en una lista negra.',
  })
  @ApiResponse({
    status: 204,
    description: 'Sesión cerrada exitosamente',
  })
  async logout() {
    // En una implementación JWT stateless, el logout se maneja en el cliente
    // Aquí podríamos implementar una lista negra de tokens si fuera necesario
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verificar si el token actual es válido' })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  async verify(@Request() req: RequestWithUser) {
    const userId = req.user.userId || req.user.id || req.user._id;
    if (!userId) {
      throw new UnauthorizedException('No se puede verificar el token sin userId');
    }
    return this.authService.verifyToken(userId);
  }
}
