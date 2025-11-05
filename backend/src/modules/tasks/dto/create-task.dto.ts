import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  MaxLength,
  IsMongoId,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, TaskPriority } from '../schemas/task.schema';

export class SubtaskDto {
  @ApiProperty({
    description: 'Título de la subtarea',
    example: 'Revisar documento',
  })
  @IsNotEmpty({ message: 'El título de la subtarea es requerido' })
  @IsString({ message: 'El título debe ser texto' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title!: string;

  @ApiProperty({
    description: 'Estado de la subtarea',
    example: false,
    default: false,
  })
  @IsOptional()
  completed?: boolean;
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Completar informe mensual',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser texto' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title!: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example: 'Preparar y enviar el informe de ventas del mes',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Estado de la tarea',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Estado inválido' })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridad inválida' })
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Fecha de vencimiento (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha de vencimiento inválida' })
  dueDate?: string;

  @ApiProperty({
    description: 'Etiquetas personalizadas',
    type: [String],
    example: ['urgente', 'revision'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser texto' })
  tags?: string[];

  @ApiProperty({
    description: 'Lista de subtareas',
    type: [SubtaskDto],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las subtareas deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  subtasks?: SubtaskDto[];

  @ApiProperty({
    description: 'Orden para drag & drop',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  order?: number;
}
