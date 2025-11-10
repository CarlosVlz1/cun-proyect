import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error(`Error en autenticación JWT: ${err.message}`);
      throw err;
    }
    
    if (!user) {
      throw new UnauthorizedException('No autorizado - Token inválido o expirado');
    }
    
    return user;
  }
}

