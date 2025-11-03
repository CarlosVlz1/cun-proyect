import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

@ApiTags('statistics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('general')
  @ApiOperation({ summary: 'Obtener estadísticas generales del usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getGeneralStats(@Request() req: RequestWithUser) {
    return this.statisticsService.getGeneralStats(req.user.userId);
  }

  @Get('by-priority')
  @ApiOperation({ summary: 'Obtener estadísticas por prioridad' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getByPriority(@Request() req: RequestWithUser) {
    return this.statisticsService.getByPriority(req.user.userId);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Obtener estadísticas por categoría' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getByCategory(@Request() req: RequestWithUser) {
    return this.statisticsService.getByCategory(req.user.userId);
  }

  @Get('weekly-productivity')
  @ApiOperation({ summary: 'Obtener productividad semanal (tareas completadas por día)' })
  @ApiResponse({ status: 200, description: 'Productividad obtenida exitosamente' })
  async getWeeklyProductivity(@Request() req: RequestWithUser) {
    return this.statisticsService.getWeeklyProductivity(req.user.userId);
  }

  @Get('monthly-productivity')
  @ApiOperation({ summary: 'Obtener productividad mensual (tareas completadas por día)' })
  @ApiResponse({ status: 200, description: 'Productividad obtenida exitosamente' })
  async getMonthlyProductivity(@Request() req: RequestWithUser) {
    return this.statisticsService.getMonthlyProductivity(req.user.userId);
  }
}
