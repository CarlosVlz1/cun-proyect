import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    
    if (authHeader) {
      this.logger.log(`🔐 Intentando autenticar con token: ${authHeader.substring(0, 20)}...`);
    } else {
      this.logger.warn('⚠️  No se encontró header Authorization');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error(`❌ Error en autenticación JWT: ${err.message}`);
      throw err;
    }
    
    if (!user) {
      this.logger.error(`❌ Usuario no encontrado después de validar token. Info: ${JSON.stringify(info)}`);
      throw new UnauthorizedException('No autorizado - Token inválido o expirado');
    }
    
    this.logger.log(`✅ Usuario autenticado: ${user.userId} (${user.username})`);
    return user;
  }
}

