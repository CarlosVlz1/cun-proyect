import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Request() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de tareas obtenida exitosamente' })
  async findAll(@Request() req: RequestWithUser, @Query() filterDto: FilterTaskDto) {
    return this.tasksService.findAll(req.user.userId, filterDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtener tareas próximas a vencer' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 200, description: 'Tareas próximas obtenidas' })
  async getUpcoming(@Request() req: RequestWithUser, @Query('days') days?: number) {
    return this.tasksService.getUpcoming(req.user.userId, days);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Obtener tareas vencidas' })
  @ApiResponse({ status: 200, description: 'Tareas vencidas obtenidas' })
  async getOverdue(@Request() req: RequestWithUser) {
    return this.tasksService.getOverdue(req.user.userId);
  }

  @Get('count-by-status')
  @ApiOperation({ summary: 'Contar tareas por estado' })
  @ApiResponse({ status: 200, description: 'Conteo obtenido exitosamente' })
  async countByStatus(@Request() req: RequestWithUser) {
    return this.tasksService.countByStatus(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(req.user.userId, id, updateTaskDto);
  }

  @Patch(':id/toggle-complete')
  @ApiOperation({ summary: 'Marcar/desmarcar tarea como completada' })
  @ApiResponse({ status: 200, description: 'Estado de tarea actualizado' })
  async toggleComplete(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.toggleComplete(req.user.userId, id);
  }

  @Patch(':id/toggle-archive')
  @ApiOperation({ summary: 'Archivar/desarchivar tarea' })
  @ApiResponse({ status: 200, description: 'Estado de archivo actualizado' })
  async toggleArchive(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.toggleArchive(req.user.userId, id);
  }

  @Post('bulk-update-order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Actualizar el orden de múltiples tareas (drag & drop)' })
  @ApiResponse({ status: 204, description: 'Orden actualizado exitosamente' })
  async bulkUpdateOrder(
    @Request() req: RequestWithUser,
    @Body() bulkUpdateDto: BulkUpdateOrderDto
  ) {
    return this.tasksService.bulkUpdateOrder(req.user.userId, bulkUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 204, description: 'Tarea eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.remove(req.user.userId, id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar múltiples tareas' })
  @ApiResponse({ status: 204, description: 'Tareas eliminadas exitosamente' })
  async bulkDelete(@Request() req: RequestWithUser, @Body() body: { ids: string[] }) {
    return this.tasksService.bulkDelete(req.user.userId, body.ids);
  }
}
