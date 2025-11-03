import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

@ApiTags('backup')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('export')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="tareas-backup.json"')
  @ApiOperation({ summary: 'Exportar todos los datos del usuario a JSON' })
  @ApiResponse({ status: 200, description: 'Datos exportados exitosamente' })
  async exportData(@Request() req: RequestWithUser): Promise<any> {
    return this.backupService.exportData(req.user.userId);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Importar datos desde un archivo JSON',
    description: 'Importa tareas y categorías. Las categorías duplicadas se omiten.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos importados exitosamente',
    schema: {
      type: 'object',
      properties: {
        imported: { type: 'number', example: 25 },
        skipped: { type: 'number', example: 3 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Formato de datos inválido' })
  async importData(@Request() req: RequestWithUser, @Body() data: any) {
    return this.backupService.importData(req.user.userId, data);
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Crear un backup completo' })
  @ApiResponse({ status: 200, description: 'Backup creado exitosamente' })
  async createBackup(@Request() req: RequestWithUser): Promise<any> {
    return this.backupService.createBackup(req.user.userId);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restaurar desde un backup' })
  @ApiResponse({ status: 200, description: 'Backup restaurado exitosamente' })
  async restoreBackup(@Request() req: RequestWithUser, @Body() backupData: any) {
    return this.backupService.restoreBackup(req.user.userId, backupData);
  }

  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar TODOS los datos del usuario',
    description:
      '⚠️ PRECAUCIÓN: Esta acción elimina permanentemente todas las tareas y categorías.',
  })
  @ApiResponse({ status: 204, description: 'Todos los datos eliminados' })
  async deleteAllData(@Request() req: RequestWithUser) {
    return this.backupService.deleteAllData(req.user.userId);
  }
}
