import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Trabajo',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Color de la categoría en formato hexadecimal',
    example: '#3B82F6',
  })
  @IsNotEmpty({ message: 'El color es requerido' })
  @IsString({ message: 'El color debe ser texto' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'El color debe ser un código hexadecimal válido (ej: #3B82F6)',
  })
  color!: string;

  @ApiProperty({
    description: 'Descripción opcional de la categoría',
    example: 'Tareas relacionadas con el trabajo',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(200, { message: 'La descripción no puede exceder 200 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Icono de la categoría (nombre de Lucide)',
    example: 'briefcase',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El icono debe ser texto' })
  icon?: string;
}
