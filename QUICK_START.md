# Guía de Inicio Rápido

Guía rápida para poner en marcha el Sistema de Gestión de Tareas en menos de 5 minutos.

## ⚡ Inicio Rápido (TL;DR)

```bash
# 1. Instalar dependencias
npm run install:all

# 2. Configurar MongoDB (usa Atlas o local)
# Edita backend/.env con tu MONGODB_URI

# 3. Configurar variables de entorno
# Backend: backend/.env
# Frontend: frontend/.env.local

# 4. Iniciar backend (Terminal 1)
cd backend && npm run start:dev

# 5. Iniciar frontend (Terminal 2)
cd frontend && npm run dev

# 6. Abrir navegador
# http://localhost:3000
```

## 📝 Configuración Mínima

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/tareas_db
JWT_SECRET=mi-secret-key-super-segura-de-al-menos-32-caracteres
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=mi-secret-key-super-segura-de-al-menos-32-caracteres
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🎯 Primeros Pasos

1. **Regístrate**: Ve a http://localhost:3000/register
2. **Crea tu cuenta**: Usa un email y contraseña
3. **Inicia sesión**: Serás redirigido automáticamente
4. **Crea tu primera tarea**: Haz clic en "Nueva Tarea"
5. **Organiza tus tareas**: Usa etiquetas y filtros para organizar

## 🔑 Endpoints Principales

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Swagger Docs**: http://localhost:4000/api/docs
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

## 💡 Tips Rápidos

- Usa **MongoDB Atlas** (gratis) para evitar configurar MongoDB local
- Genera secrets seguros con: `openssl rand -base64 32`
- El backend expone Swagger en `/api/docs` para probar la API
- Los logs del backend se guardan en `backend/logs/`

## 🐛 Problemas Comunes

**Backend no inicia**: Verifica que MongoDB esté corriendo y la URI sea correcta.

**Frontend no conecta**: Verifica que `NEXT_PUBLIC_API_URL` apunte a `http://localhost:4000/api`.

**Error de autenticación**: Asegúrate de que `JWT_SECRET` y `NEXTAUTH_SECRET` tengan al menos 32 caracteres.

## 📚 Más Información

Para más detalles, consulta:
- [INSTALLATION.md](./INSTALLATION.md) - Instalación completa
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- [README.md](./README.md) - Documentación general
