import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  PENDING = 'pendiente',
  IN_PROGRESS = 'en_progreso',
  COMPLETED = 'completada',
}

export enum TaskPriority {
  LOW = 'baja',
  MEDIUM = 'media',
  HIGH = 'alta',
}

@Schema({ _id: false })
export class Subtask {
  @ApiProperty({ description: 'ID único de la subtarea' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  id!: Types.ObjectId;

  @ApiProperty({ description: 'Título de la subtarea' })
  @Prop({ required: true })
  title!: string;

  @ApiProperty({ description: 'Indica si la subtarea está completada' })
  @Prop({ default: false })
  completed!: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Completar informe mensual',
  })
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 200 })
  title!: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example: 'Preparar y enviar el informe de ventas del mes',
    required: false,
  })
  @Prop({ default: '', maxlength: 2000 })
  description!: string;

  @ApiProperty({
    description: 'Estado de la tarea',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @Prop({
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @ApiProperty({
    description: 'Fecha de vencimiento',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @Prop({ default: null })
  dueDate?: Date;

  @ApiProperty({
    description: 'Etiquetas personalizadas',
    type: [String],
    example: ['urgente', 'revision'],
  })
  @Prop({ type: [String], default: [] })
  tags!: string[];

  @ApiProperty({
    description: 'Lista de subtareas',
    type: [Subtask],
  })
  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks!: Subtask[];

  @ApiProperty({
    description: 'Orden para drag & drop',
    example: 0,
  })
  @Prop({ default: 0 })
  order!: number;

  @ApiProperty({
    description: 'ID del usuario propietario',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user!: Types.ObjectId;

  @ApiProperty({
    description: 'Indica si la tarea está archivada',
    example: false,
  })
  @Prop({ default: false })
  archived!: boolean;

  @ApiProperty({
    description: 'Fecha de finalización real',
    required: false,
  })
  @Prop({ default: null })
  completedAt?: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Índices compuestos para consultas eficientes
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, archived: 1 });
TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Middleware para actualizar completedAt cuando la tarea se completa
TaskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === TaskStatus.COMPLETED && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== TaskStatus.COMPLETED) {
      this.completedAt = undefined;
    }
  }
  next();
});

// Virtual para ID
TaskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Configuración de toJSON
TaskSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: Record<string, any>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
