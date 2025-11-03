import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskOrderDto {
  @ApiProperty({
    description: 'ID de la tarea',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId({ message: 'ID de tarea inválido' })
  id!: string;

  @ApiProperty({
    description: 'Nueva posición',
    example: 0,
  })
  @IsNumber({}, { message: 'El orden debe ser un número' })
  order!: number;
}

export class BulkUpdateOrderDto {
  @ApiProperty({
    description: 'Array de tareas con sus nuevas posiciones',
    type: [TaskOrderDto],
  })
  @IsArray({ message: 'Debe ser un array de tareas' })
  @ValidateNested({ each: true })
  @Type(() => TaskOrderDto)
  tasks!: TaskOrderDto[];
}
