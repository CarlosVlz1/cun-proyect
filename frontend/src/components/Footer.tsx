'use client';

import { Box, Container, Typography, Link as MuiLink, Stack } from '@mui/material';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Task Manager. Todos los derechos reservados.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Sistema de Gestión de Tareas - Cumpliendo con ISO 25010
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.875rem',
              }}
            >
              Inicio
            </MuiLink>
            <MuiLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Aquí se puede agregar la funcionalidad de términos de servicio
              }}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.875rem',
              }}
            >
              Términos de Servicio
            </MuiLink>
            <MuiLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Aquí se puede agregar la funcionalidad de política de privacidad
              }}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.875rem',
              }}
            >
              Política de Privacidad
            </MuiLink>
            <MuiLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Aquí se puede agregar la funcionalidad de contacto
              }}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.875rem',
              }}
            >
              Contacto
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

