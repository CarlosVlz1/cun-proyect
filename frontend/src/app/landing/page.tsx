'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import {
  Dashboard,
  Task,
  Folder,
  BarChart,
  Security,
  Speed,
  Group,
  Cloud,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: <Dashboard />,
    title: 'Dashboard Intuitivo',
    description: 'Vista general de todas tus tareas, estadísticas y métricas en un solo lugar.',
  },
  {
    icon: <Task />,
    title: 'Gestión de Tareas',
    description: 'Crea, edita y organiza tus tareas con estados, prioridades y fechas de vencimiento.',
  },
  {
    icon: <Folder />,
    title: 'Categorías Personalizadas',
    description: 'Organiza tus tareas con categorías personalizadas, colores e iconos únicos.',
  },
  {
    icon: <BarChart />,
    title: 'Estadísticas Avanzadas',
    description: 'Analiza tu productividad con gráficos y métricas detalladas de tu desempeño.',
  },
  {
    icon: <Security />,
    title: 'Seguridad Garantizada',
    description: 'Tus datos están protegidos con autenticación segura y encriptación.',
  },
  {
    icon: <Speed />,
    title: 'Alto Rendimiento',
    description: 'Sistema rápido y eficiente diseñado para manejar miles de tareas sin problemas.',
  },
];

const benefits = [
  'Organización completa de tareas y proyectos',
  'Seguimiento de progreso en tiempo real',
  'Filtros y búsqueda avanzada',
  'Notificaciones y recordatorios',
  'Interfaz moderna y fácil de usar',
  'Acceso desde cualquier dispositivo',
];

const steps = [
  {
    number: '1',
    title: 'Crea tu cuenta',
    description: 'Regístrate de forma rápida y sencilla con tu email y usuario.',
  },
  {
    number: '2',
    title: 'Organiza tus tareas',
    description: 'Crea categorías personalizadas y comienza a agregar tus tareas.',
  },
  {
    number: '3',
    title: 'Gestiona y realiza seguimiento',
    description: 'Mantén el control de todo con nuestro dashboard intuitivo.',
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #fafbfc 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Task Manager
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                fontWeight: 400,
              }}
            >
              Sistema completo de gestión de tareas diseñado para maximizar tu productividad
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: { xs: '1rem', md: '1.125rem' },
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Organiza, prioriza y completa tus tareas de manera eficiente. Cumpliendo con los más altos estándares de calidad (ISO 25010).
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
              >
                Comenzar Gratis
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Características Principales
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Todo lo que necesitas para gestionar tus tareas de manera eficiente
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                ¿Por qué elegir Task Manager?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Nuestro sistema está diseñado pensando en ti, con todas las herramientas necesarias para
                mantenerte organizado y productivo.
              </Typography>
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CheckCircle sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body1" color="text.secondary">
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 10px 15px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Group sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Diseñado para Equipos
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Gestiona proyectos individuales o colaborativos con facilidad
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              ¿Cómo Funciona?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Comienza a usar Task Manager en solo 3 sencillos pasos
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Standards Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: 'secondary.main',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 10px 15px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Cloud sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Cumplimiento ISO 25010
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Nuestro sistema cumple con los más altos estándares de calidad de software
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Calidad Garantizada
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Task Manager está diseñado siguiendo los estándares ISO 25010, asegurando:
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircle sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Funcionalidad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Todas las características esenciales para la gestión de tareas
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircle sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Rendimiento
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sistema rápido y eficiente incluso con grandes volúmenes de datos
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircle sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Usabilidad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interfaz intuitiva y fácil de usar para todos los usuarios
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            ¿Listo para mejorar tu productividad?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Únete a Task Manager hoy y comienza a gestionar tus tareas de manera eficiente
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                bgcolor: 'white !important',
                color: 'primary.main !important',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  bgcolor: '#f8fafc !important',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Crear Cuenta Gratis
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Ya tengo cuenta
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

