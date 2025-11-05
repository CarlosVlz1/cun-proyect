'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { tasksService } from '@/services/api/tasks.service';
import { CreateTaskData, TaskStatus, TaskPriority } from '@/types';
import toast from 'react-hot-toast';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({ isOpen, onClose, onTaskCreated }: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    tags: [],
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    setLoading(true);
    try {
      const taskData: CreateTaskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        tags: formData.tags?.filter((tag) => tag.trim()) || [],
      };

      await tasksService.createTask(taskData);
      toast.success('Tarea creada exitosamente');
      resetForm();
      onTaskCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.message || 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      dueDate: '',
      tags: [],
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData({ ...formData, tags });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Crear Nueva Tarea
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              fullWidth
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Completar informe mensual"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada de la tarea..."
              multiline
              rows={4}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  label="Estado"
                >
                  <MenuItem value={TaskStatus.PENDING}>Pendiente</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>En Progreso</MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>Completada</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  label="Prioridad"
                >
                  <MenuItem value={TaskPriority.LOW}>Baja</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>Media</MenuItem>
                  <MenuItem value={TaskPriority.HIGH}>Alta</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Fecha de Vencimiento"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Etiquetas"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Ej: urgente, revisión, importante (separadas por comas)"
              helperText="Separa las etiquetas con comas"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Tarea'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
