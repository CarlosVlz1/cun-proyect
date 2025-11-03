import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Trabajo',
  })
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 50 })
  name!: string;

  @ApiProperty({
    description: 'Color de la categoría en formato hexadecimal',
    example: '#3B82F6',
  })
  @Prop({
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  })
  color!: string;

  @ApiProperty({
    description: 'Descripción opcional de la categoría',
    example: 'Tareas relacionadas con el trabajo',
    required: false,
  })
  @Prop({ default: '', maxlength: 200 })
  description!: string;

  @ApiProperty({
    description: 'Icono de la categoría (nombre de Lucide)',
    example: 'briefcase',
    required: false,
  })
  @Prop({ default: 'folder' })
  icon!: string;

  @ApiProperty({
    description: 'ID del usuario propietario',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user!: Types.ObjectId;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Índice compuesto para evitar categorías duplicadas por usuario
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

// Virtual para ID
CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Configuración de toJSON
CategorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: Record<string, any>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
