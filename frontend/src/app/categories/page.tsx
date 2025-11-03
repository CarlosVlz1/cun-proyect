'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { DashboardLayout } from '@/components/DashboardLayout';
import { categoriesService } from '@/services/api/categories.service';
import { Category, CreateCategoryData } from '@/types';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    color: '#06b6d4',
    description: '',
    icon: '',
  });

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    loadCategories();
  }, [sessionStatus]);

  const loadCategories = async () => {
    if (sessionStatus === 'loading' || !session) {
      return;
    }

    setLoading(true);
    try {
      console.log('Loading categories...');
      const response = await categoriesService.getCategories();
      console.log('Categories response:', response);
      
      // El backend puede retornar un array directamente o un objeto con data
      let categoriesArray: Category[] = [];
      
      if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        categoriesArray = (response as any).data;
      } else if (response && typeof response === 'object' && 'categories' in response && Array.isArray((response as any).categories)) {
        categoriesArray = (response as any).categories;
      }
      
      console.log('Final categories array:', categoriesArray);
      // Log cada categoría para verificar el campo icon
      categoriesArray.forEach((cat) => {
        console.log(`Category "${cat.name}": icon="${cat.icon}", type=${typeof cat.icon}, empty=${!cat.icon || cat.icon.trim() === ''}`);
      });
      setCategories(categoriesArray);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Error al cargar las categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Asegurar que el icono se envíe correctamente (no vacío)
      const categoryData = {
        ...formData,
        icon: formData.icon && formData.icon.trim() ? formData.icon.trim() : undefined,
      };
      console.log('Submitting category data:', categoryData);
      
      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, categoryData);
        toast.success('Categoría actualizada');
      } else {
        await categoriesService.createCategory(categoryData);
        toast.success('Categoría creada');
      }
      setIsCreateDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      description: category.description || '',
      icon: category.icon || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoriesService.deleteCategory(id);
      toast.success('Categoría eliminada');
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#06b6d4',
      description: '',
      icon: '',
    });
    setEditingCategory(null);
  };

  const handleClose = () => {
    setIsCreateDialogOpen(false);
    resetForm();
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
            Categorías
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
            Nueva Categoría
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                No tienes categorías aún
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Crea categorías para organizar mejor tus tareas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Las categorías te ayudan a agrupar tareas relacionadas
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Crear Primera Categoría
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Tienes {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
            </Alert>
            <Grid container spacing={3}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
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
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            flexShrink: 0,
                          }}
                        >
                          {category.icon || '📁'}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                              mb: 0.5,
                              wordBreak: 'break-word',
                            }}
                          >
                            {category.name}
                          </Typography>
                          {category.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {category.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(category)}
                          sx={{ flex: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(category.id)}
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

        <Dialog
          open={isCreateDialogOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Trabajo"
                  required
                />

                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción opcional..."
                  multiline
                  rows={3}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        style={{
                          width: '60px',
                          height: '40px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      />
                      <TextField
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#06b6d4"
                        size="small"
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="Icono (emoji)"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📁"
                    inputProps={{ maxLength: 2 }}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
