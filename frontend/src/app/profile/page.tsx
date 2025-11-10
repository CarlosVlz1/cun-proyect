'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Edit, Save, Cancel, Lock, Delete } from '@mui/icons-material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { usersService } from '@/services/api/users.service';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userData = await usersService.getProfile();
      setUser(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersService.updateProfile(formData);
      toast.success('Perfil actualizado');
      setEditing(false);
      loadProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    try {
      await usersService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Contraseña actualizada');
      setChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de desactivar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await usersService.deleteAccount();
      toast.success('Cuenta desactivada');
      signOut({ callbackUrl: '/landing' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al desactivar la cuenta');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
          Mi Perfil
        </Typography>

        {/* Información del Perfil */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Información Personal
              </Typography>
              {!editing && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                >
                  Editar
                </Button>
              )}
            </Box>

            {editing ? (
              <form onSubmit={handleUpdateProfile}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Nombre de Usuario"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" startIcon={<Save />}>
                      Guardar Cambios
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setEditing(false);
                        loadProfile();
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              </form>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user?.fullName || '-'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user?.email || '-'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Nombre de Usuario
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user?.username || '-'}
                  </Typography>
                </Box>
                {user?.createdAt && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Miembro desde
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Contraseña
              </Typography>
              {!changingPassword && (
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setChangingPassword(true)}
                >
                  Cambiar Contraseña
                </Button>
              )}
            </Box>

            {changingPassword && (
              <form onSubmit={handleChangePassword}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Contraseña Actual"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    helperText="Mínimo 8 caracteres, con mayúscula, minúscula y número"
                    inputProps={{ minLength: 8 }}
                  />
                  <TextField
                    fullWidth
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" startIcon={<Save />}>
                      Actualizar Contraseña
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Zona Peligrosa */}
        <Card
          sx={{
            border: '1.5px solid',
            borderColor: 'error.main',
            bgcolor: 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Delete sx={{ color: 'error.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                Zona Peligrosa
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Desactivar tu cuenta eliminará permanentemente todos tus datos. Esta acción no se puede deshacer.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteAccount}
              sx={{
                borderColor: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              Desactivar Cuenta
            </Button>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
