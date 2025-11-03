import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'john_doe',
  })
  @Prop({ required: true, unique: true, trim: true, minlength: 3, maxlength: 30 })
  username!: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'john@example.com',
  })
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  @Prop({ required: true, trim: true })
  fullName!: string;

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @Prop({ default: null })
  avatar?: string;

  @ApiProperty({
    description: 'Preferencias del usuario',
    example: { theme: 'dark', language: 'es', notifications: true },
  })
  @Prop({
    type: {
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
      language: { type: String, enum: ['es', 'en'], default: 'es' },
      notifications: { type: Boolean, default: true },
      dateFormat: { type: String, default: 'dd/MM/yyyy' },
    },
    default: {},
  })
  preferences!: {
    theme: 'light' | 'dark' | 'auto';
    language: 'es' | 'en';
    notifications: boolean;
    dateFormat: string;
  };

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @Prop({ default: true })
  isActive!: boolean;

  @ApiProperty({
    description: 'Fecha de último inicio de sesión',
  })
  @Prop({ default: null })
  lastLogin?: Date;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
  })
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índices adicionales (eliminamos email y username porque ya tienen unique: true)
UserSchema.index({ isActive: 1 });

// Virtual para ID
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Asegurar que los virtuals se incluyan en JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: Record<string, any>) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
