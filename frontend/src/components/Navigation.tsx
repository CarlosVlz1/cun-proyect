'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Dashboard, Task, BarChart, Person } from '@mui/icons-material';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Dashboard },
  { name: 'Tareas', href: '/tasks', icon: Task },
  { name: 'Estadísticas', href: '/statistics', icon: BarChart },
  { name: 'Perfil', href: '/profile', icon: Person },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <AppBar position="static" sx={{ mb: 2, color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'primary.main' }}>
                Task Manager
              </Box>
            </Link>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                    <Button
                      startIcon={<Icon />}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          color: 'primary.main',
                        },
                      }}
                    >
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => signOut({ callbackUrl: '/login' })}
            size="small"
          >
            Cerrar Sesión
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
