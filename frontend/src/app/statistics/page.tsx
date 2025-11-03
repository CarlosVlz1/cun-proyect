'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { statisticsService } from '@/services/api/statistics.service';
import { GeneralStats, PriorityStats, ProductivityData, TaskPriority } from '@/types';
import toast from 'react-hot-toast';

export default function StatisticsPage() {
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [priorityStats, setPriorityStats] = useState<PriorityStats | null>(null);
  const [weeklyProductivity, setWeeklyProductivity] = useState<ProductivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [general, priority, weekly] = await Promise.all([
        statisticsService.getGeneralStats(),
        statisticsService.getByPriority(),
        statisticsService.getWeeklyProductivity(),
      ]);
      setGeneralStats(general);
      setPriorityStats(priority);
      setWeeklyProductivity(weekly);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { border: '#ef4444', text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      case TaskPriority.MEDIUM:
        return { border: '#f59e0b', text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      case TaskPriority.LOW:
        return { border: '#10b981', text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      default:
        return { border: '#6366f1', text: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' };
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
          Estadísticas
        </Typography>

        {/* Estadísticas Generales */}
        {generalStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total de Tareas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {generalStats.totalTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Completadas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {generalStats.completedTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Pendientes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {generalStats.pendingTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tasa de Completación
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {Math.round(generalStats.completionRate)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Estadísticas por Prioridad */}
        {priorityStats && (
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                Por Prioridad
              </Typography>
              <Grid container spacing={3}>
                {[TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW].map((priority) => {
                  const colors = getPriorityColor(priority);
                  const stats = priorityStats[priority];
                  const priorityLabel = priority === TaskPriority.HIGH ? 'Alta' : priority === TaskPriority.MEDIUM ? 'Media' : 'Baja';
                  
                  return (
                    <Grid item xs={12} md={4} key={priority}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: `1.5px solid ${colors.border}`,
                          backgroundColor: colors.bg,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text }}>
                          {priorityLabel}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Total:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {stats?.total || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Completadas:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                              {stats?.completed || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Pendientes:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                              {stats?.pending || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              En Progreso:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                              {stats?.inProgress || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Productividad Semanal */}
        {weeklyProductivity.length > 0 && (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                Productividad Semanal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {weeklyProductivity.map((item, idx) => {
                  const percentage = Math.min((item.count / 10) * 100, 100);
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 300, ml: 2 }}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percentage}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: 4,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', minWidth: 32, textAlign: 'right' }}>
                          {item.count}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}

        {!generalStats && !priorityStats && weeklyProductivity.length === 0 && (
          <Card>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Alert severity="info">No hay estadísticas disponibles aún</Alert>
            </CardContent>
          </Card>
        )}
      </Container>
    </DashboardLayout>
  );
}
