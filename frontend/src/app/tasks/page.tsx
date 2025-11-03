'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, CheckCircle, Delete, Edit } from '@mui/icons-material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { tasksService } from '@/services/api/tasks.service';
import { Task, TaskStatus, TaskPriority, TaskFilters } from '@/types';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: undefined,
    priority: undefined,
    archived: false,
  });

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    
    const filter = searchParams.get('filter');
    if (filter === 'overdue') {
      loadOverdueTasks();
    } else if (filter === 'upcoming') {
      loadUpcomingTasks();
    } else {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sessionStatus]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    
    const filter = searchParams.get('filter');
    if (!filter) {
      const timeoutId = setTimeout(() => {
        loadTasks();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.priority, sessionStatus]);

  const loadTasks = async () => {
    if (sessionStatus === 'loading' || !session) {
      console.log('Session not ready:', { sessionStatus, hasSession: !!session });
      return;
    }

    setLoading(true);
    try {
      // Limpiar filtros undefined para que no se envíen en la query
      // Hacerlo igual que el dashboard: solo enviar los filtros que tienen valor
      const cleanFilters: TaskFilters = {};
      
      if (filters.search && filters.search.trim()) {
        cleanFilters.search = filters.search.trim();
      }
      if (filters.status) {
        cleanFilters.status = filters.status;
      }
      if (filters.priority) {
        cleanFilters.priority = filters.priority;
      }
      // NO enviar archived: false - el backend usa false por defecto
      // Solo enviar archived: true si queremos ver archivadas
      
      console.log('=== LOAD TASKS START ===');
      console.log('Session:', session);
      console.log('Access token:', (session as any)?.accessToken ? 'EXISTS' : 'MISSING');
      console.log('Loading tasks with filters:', cleanFilters);
      
      const response = await tasksService.getTasks(cleanFilters);
      
      console.log('=== RESPONSE RECEIVED ===');
      console.log('Tasks response (raw):', response);
      
      // El backend SIEMPRE retorna { tasks: [], pagination: {} }
      // Hacerlo igual que el dashboard que funciona
      let tasksArray: Task[] = [];
      
      if (response && typeof response === 'object') {
        // Caso 1: response.tasks existe (caso más común, igual que dashboard)
        if ('tasks' in response && Array.isArray((response as any).tasks)) {
          tasksArray = (response as any).tasks;
          console.log('✅ Found tasks in response.tasks:', tasksArray.length);
        }
        // Caso 2: Es un TasksResponse directamente
        else if (Array.isArray(response)) {
          tasksArray = response;
          console.log('✅ Response is array directly:', tasksArray.length);
        } else {
          console.error('❌ Unexpected response structure:', JSON.stringify(response, null, 2));
        }
      }
      
      console.log('Final tasks array:', tasksArray);
      console.log('Tasks count:', tasksArray.length);
      
      setTasks(tasksArray);
    } catch (error: any) {
      console.error('=== ERROR LOADING TASKS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las tareas';
      toast.error(errorMessage);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOverdueTasks = async () => {
    if (sessionStatus === 'loading' || !session) return;
    
    setLoading(true);
    try {
      const overdue = await tasksService.getOverdue();
      setTasks(Array.isArray(overdue) ? overdue : []);
    } catch (error: any) {
      console.error('Error loading overdue tasks:', error);
      toast.error(error.response?.data?.message || 'Error al cargar las tareas vencidas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingTasks = async () => {
    if (sessionStatus === 'loading' || !session) return;
    
    setLoading(true);
    try {
      const upcoming = await tasksService.getUpcoming(7);
      setTasks(Array.isArray(upcoming) ? upcoming : []);
    } catch (error: any) {
      console.error('Error loading upcoming tasks:', error);
      toast.error(error.response?.data?.message || 'Error al cargar las próximas tareas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await tasksService.toggleComplete(taskId);
      toast.success('Estado actualizado');
      loadTasks();
    } catch (error: any) {
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await tasksService.deleteTask(taskId);
      toast.success('Tarea eliminada');
      loadTasks();
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

  if (sessionStatus === 'loading') {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Tareas
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Nueva Tarea
          </Button>
        </Box>

        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar tareas..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, status: (e.target.value as TaskStatus) || undefined })
                  }
                  label="Estado"
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value={TaskStatus.PENDING}>Pendiente</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>En Progreso</MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>Completada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={filters.priority || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, priority: (e.target.value as TaskPriority) || undefined })
                  }
                  label="Prioridad"
                >
                  <MenuItem value="">Todas las prioridades</MenuItem>
                  <MenuItem value={TaskPriority.LOW}>Baja</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>Media</MenuItem>
                  <MenuItem value={TaskPriority.HIGH}>Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                No tienes tareas aún
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Comienza a organizar tu trabajo creando tu primera tarea
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Puedes crear tareas desde aquí o desde el dashboard
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Crear Primera Tarea
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/dashboard"
                >
                  Ir al Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Se encontraron {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
            </Alert>
            <Grid container spacing={3}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Link href={`/tasks/${task.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              '&:hover': { textDecoration: 'underline' },
                              cursor: 'pointer',
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Link>
                        <Chip
                          label={getPriorityLabel(task.priority)}
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                      </Box>
                      {task.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip label={getStatusLabel(task.status)} size="small" variant="outlined" />
                        {task.dueDate && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      {task.categories && task.categories.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {task.categories.map((cat) => {
                            // Determinar el icono a mostrar
                            // Si el icono es 'folder' (default del backend) o está vacío, usar el emoji por defecto
                            let displayIcon = '📁';
                            if (cat.icon && typeof cat.icon === 'string') {
                              const iconTrimmed = cat.icon.trim();
                              // Si es un emoji (no es 'folder' ni está vacío), usarlo
                              if (iconTrimmed && iconTrimmed !== 'folder' && iconTrimmed.length > 0) {
                                displayIcon = iconTrimmed;
                              }
                            }
                            
                            return (
                              <Chip
                                key={cat.id}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <span>{displayIcon}</span>
                                    <span>{cat.name}</span>
                                  </Box>
                                }
                                size="small"
                                sx={{
                                  backgroundColor: `${cat.color}20`,
                                  color: cat.color,
                                  border: `1px solid ${cat.color}40`,
                                  fontSize: '0.7rem',
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
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleToggleComplete(task.id)}
                          sx={{ flex: 1 }}
                        >
                          {task.status === TaskStatus.COMPLETED ? 'Desmarcar' : 'Completar'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(task.id)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <CreateTaskDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onTaskCreated={() => {
            loadTasks();
            setIsCreateDialogOpen(false);
          }}
        />
      </Container>
    </DashboardLayout>
  );
}
