import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsMongoId, IsBoolean } from 'class-validator';
import { TaskStatus, TaskPriority } from '../schemas/task.schema';
import { Type } from 'class-transformer';

export class FilterTaskDto {
  @ApiProperty({
    description: 'Filtrar por estado',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    description: 'Filtrar por prioridad',
    enum: TaskPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Filtrar por etiqueta',
    required: false,
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({
    description: 'Buscar en título, descripción y etiquetas',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Mostrar tareas archivadas',
    required: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  archived?: boolean;

  @ApiProperty({
    description: 'Ordenar por campo',
    enum: ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'order'],
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Orden ascendente o descendente',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Número de página',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Límite de resultados por página',
    required: false,
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

