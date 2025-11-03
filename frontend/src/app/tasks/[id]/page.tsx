'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { ArrowBack, Edit, Delete, CheckCircle, Archive } from '@mui/icons-material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { tasksService } from '@/services/api/tasks.service';
import { categoriesService } from '@/services/api/categories.service';
import { Task, TaskStatus, TaskPriority, UpdateTaskData, Category } from '@/types';
import toast from 'react-hot-toast';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<UpdateTaskData>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    categories: [],
  });

  useEffect(() => {
    if (taskId) {
      loadTask();
      loadCategories();
    }
  }, [taskId]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      const categoriesArray = Array.isArray(data) ? data : [];
      setAvailableCategories(categoriesArray);
    } catch (error: any) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTask = async () => {
    setLoading(true);
    try {
      const taskData = await tasksService.getTask(taskId);
      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().slice(0, 16) : '',
        categories: taskData.categories?.map((cat) => cat.id) || [],
      });
    } catch (error: any) {
      toast.error('Error al cargar la tarea');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: UpdateTaskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };
      await tasksService.updateTask(taskId, updateData);
      toast.success('Tarea actualizada');
      setEditing(false);
      loadTask();
    } catch (error: any) {
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleToggleComplete = async () => {
    try {
      await tasksService.toggleComplete(taskId);
      toast.success('Estado actualizado');
      loadTask();
    } catch (error: any) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleToggleArchive = async () => {
    try {
      await tasksService.toggleArchive(taskId);
      toast.success(task?.archived ? 'Tarea desarchivada' : 'Tarea archivada');
      loadTask();
    } catch (error: any) {
      toast.error('Error al archivar la tarea');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await tasksService.deleteTask(taskId);
      toast.success('Tarea eliminada');
      router.push('/tasks');
    } catch (error: any) {
      toast.error('Error al eliminar la tarea');
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: 'Pendiente',
      [TaskStatus.IN_PROGRESS]: 'En Progreso',
      [TaskStatus.COMPLETED]: 'Completada',
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    const labels: Record<TaskPriority, string> = {
      [TaskPriority.LOW]: 'Baja',
      [TaskPriority.MEDIUM]: 'Media',
      [TaskPriority.HIGH]: 'Alta',
    };
    return labels[priority];
  };

  const getPriorityColor = (priority: TaskPriority): 'default' | 'warning' | 'error' => {
    const colors: Record<TaskPriority, 'default' | 'warning' | 'error'> = {
      [TaskPriority.LOW]: 'default',
      [TaskPriority.MEDIUM]: 'warning',
      [TaskPriority.HIGH]: 'error',
    };
    return colors[priority];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg">
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Tarea no encontrada
              </Typography>
              <Link href="/tasks" style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Volver a Tareas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Link href="/tasks" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Volver a Tareas
            </Button>
          </Link>
        </Box>

        {editing ? (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                Editar Tarea
              </Typography>
              <form onSubmit={handleUpdate}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={4}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                    </Grid>
                  </Grid>

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
                      onChange={(e) => setFormData({ ...formData, categories: e.target.value as string[] })}
                      input={<OutlinedInput label="Categorías" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((categoryId, index) => {
                            const category = availableCategories.find((cat) => cat.id === categoryId);
                            return category ? (
                              <Chip
                                key={`category-${categoryId}-${index}`}
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
                    >
                      {availableCategories.map((category) => (
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
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                    <Button type="submit" variant="contained">
                      Guardar Cambios
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => setEditing(false)}>
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      label={getPriorityLabel(task.priority)}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                    <Chip label={getStatusLabel(task.status)} size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Box>

              {task.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {task.description}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {task.dueDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Fecha de Vencimiento
                    </Typography>
                    <Typography variant="body1">
                      {new Date(task.dueDate).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {task.categories && task.categories.length > 0 && (
                  <Grid item xs={12} sm={6} md={task.dueDate ? 8 : 12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Categorías
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {task.categories.map((cat, index) => {
                        // Determinar el icono a mostrar
                        let displayIcon = '📁';
                        if (cat.icon && typeof cat.icon === 'string') {
                          const iconTrimmed = cat.icon.trim();
                          if (iconTrimmed && iconTrimmed !== 'folder' && iconTrimmed.length > 0) {
                            displayIcon = iconTrimmed;
                          }
                        }
                        
                        return (
                          <Chip
                            key={cat.id || `category-${index}`}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span key="icon">{displayIcon}</span>
                                <span key="name">{cat.name}</span>
                              </Box>
                            }
                          size="small"
                          sx={{
                            backgroundColor: `${cat.color}20`,
                            color: cat.color,
                            border: `1px solid ${cat.color}40`,
                            '& .MuiChip-label': {
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0 8px',
                            },
                          }}
                        />
                        );
                      })}
                    </Box>
                  </Grid>
                )}
                {task.tags && task.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Etiquetas
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {task.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'secondary.main',
                            color: 'secondary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={handleToggleComplete}
                  fullWidth
                >
                  {task.status === TaskStatus.COMPLETED ? 'Marcar como Pendiente' : 'Marcar como Completada'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Archive />}
                  onClick={handleToggleArchive}
                  fullWidth
                >
                  {task.archived ? 'Desarchivar' : 'Archivar'}
                </Button>
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Creada: {new Date(task.createdAt).toLocaleString()}
                </Typography>
                {task.updatedAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Actualizada: {new Date(task.updatedAt).toLocaleString()}
                  </Typography>
                )}
                {task.completedAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Completada: {new Date(task.completedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </DashboardLayout>
  );
}
