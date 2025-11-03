'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, TrendingUp, Warning, Schedule } from '@mui/icons-material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { tasksService } from '@/services/api/tasks.service';
import { statisticsService } from '@/services/api/statistics.service';
import { Task, TaskStatus, TaskPriority, GeneralStats } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes, upcomingRes, overdueRes] = await Promise.all([
        tasksService.getTasks({ limit: 6 }),
        statisticsService.getGeneralStats(),
        tasksService.getUpcoming(7),
        tasksService.getOverdue(),
      ]);
      setTasks(tasksRes.tasks);
      setStats(statsRes);
      setUpcomingTasks(upcomingRes);
      setOverdueTasks(overdueRes);
    } catch (error: any) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    loadData();
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

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Nueva Tarea
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total de Tareas
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {stats?.totalTasks || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Completadas
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                      {stats?.completedTasks || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Pendientes
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 700 }}>
                      {stats?.pendingTasks || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tasa de Completación
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {stats?.completionRate ? `${Math.round(stats.completionRate)}%` : '0%'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {overdueTasks.length > 0 && (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'error.main',
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Warning color="error" />
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                    Tareas Vencidas ({overdueTasks.length})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {overdueTasks.slice(0, 3).map((task) => (
                    <Box key={task.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                  {overdueTasks.length > 3 && (
                    <Link href="/tasks?filter=overdue" style={{ textDecoration: 'none' }}>
                      <Button size="small" sx={{ mt: 1 }}>
                        Ver todas las tareas vencidas →
                      </Button>
                    </Link>
                  )}
                </Box>
              </Paper>
            )}

            {upcomingTasks.length > 0 && (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'warning.main',
                  bgcolor: 'rgba(251, 191, 36, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Schedule color="warning" />
                  <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 600 }}>
                    Próximas a Vencer ({upcomingTasks.length})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {upcomingTasks.slice(0, 3).map((task) => (
                    <Box key={task.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                  {upcomingTasks.length > 3 && (
                    <Link href="/tasks?filter=upcoming" style={{ textDecoration: 'none' }}>
                      <Button size="small" sx={{ mt: 1 }}>
                        Ver todas las próximas tareas →
                      </Button>
                    </Link>
                  )}
                </Box>
              </Paper>
            )}

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Tareas Recientes
                </Typography>
                <Link href="/tasks" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" size="small">
                    Ver todas →
                  </Button>
                </Link>
              </Box>
              {tasks.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No tienes tareas aún
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      Crear tu primera tarea
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Link href={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                        <Card
                          sx={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                {task.title}
                              </Typography>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip label={getStatusLabel(task.status)} size="small" variant="outlined" />
                              {task.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                            {task.categories && task.categories.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {task.categories.map((cat) => {
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
                                      key={cat.id}
                                      label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <span style={{ fontSize: '0.7rem' }}>{displayIcon}</span>
                                          <span>{cat.name}</span>
                                        </Box>
                                      }
                                    size="small"
                                    sx={{
                                      backgroundColor: `${cat.color}20`,
                                      color: cat.color,
                                      border: `1px solid ${cat.color}40`,
                                      fontSize: '0.65rem',
                                      height: '20px',
                                      '& .MuiChip-label': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '0 6px',
                                      },
                                    }}
                                  />
                                  );
                                })}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        )}

        <CreateTaskDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </Container>
    </DashboardLayout>
  );
}
