import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';

// Omitimos password y email del update básico
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {
  @ApiProperty({
    description: 'Tema de la interfaz',
    enum: ['light', 'dark', 'auto'],
    example: 'dark',
    required: false,
  })
  @IsOptional()
  @IsEnum(['light', 'dark', 'auto'], { message: 'El tema debe ser light, dark o auto' })
  theme?: 'light' | 'dark' | 'auto';

  @ApiProperty({
    description: 'Idioma de la aplicación',
    enum: ['es', 'en'],
    example: 'es',
    required: false,
  })
  @IsOptional()
  @IsEnum(['es', 'en'], { message: 'El idioma debe ser es o en' })
  language?: 'es' | 'en';

  @ApiProperty({
    description: 'Habilitar o deshabilitar notificaciones',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Las notificaciones deben ser verdadero o falso' })
  notifications?: boolean;

  @ApiProperty({
    description: 'Formato de fecha preferido',
    example: 'dd/MM/yyyy',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El formato de fecha debe ser texto' })
  dateFormat?: string;
}

