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
import { categoriesService } from '@/services/api/categories.service';
import { CreateTaskData, TaskStatus, TaskPriority, Category } from '@/types';
import toast from 'react-hot-toast';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({ isOpen, onClose, onTaskCreated }: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    categories: [],
    tags: [],
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

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
      categories: [],
      tags: [],
    });
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await categoriesService.getCategories();
      const categoriesArray = Array.isArray(data) ? data : [];
      setCategories(categoriesArray);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData({ ...formData, tags });
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setFormData({ ...formData, categories: categoryIds });
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

            <FormControl fullWidth>
              <InputLabel>Categorías</InputLabel>
              <Select
                multiple
                value={formData.categories || []}
                onChange={(e) => handleCategoryChange(e.target.value as string[])}
                input={<OutlinedInput label="Categorías" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((categoryId) => {
                      const category = categories.find((cat) => cat.id === categoryId);
                      return category ? (
                        <Chip
                          key={categoryId}
                          label={category.name}
                          size="small"
                          sx={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            border: `1px solid ${category.color}40`,
                          }}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
                disabled={loadingCategories || categories.length === 0}
              >
                {categories.length === 0 && !loadingCategories ? (
                  <MenuItem disabled>No hay categorías disponibles</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            backgroundColor: `${category.color}30`,
                            color: category.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                          }}
                        >
                          {category.icon || '📁'}
                        </Box>
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {categories.length === 0 && !loadingCategories && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Crea categorías desde la página de Categorías para organizar tus tareas
                </Typography>
              )}
            </FormControl>

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
