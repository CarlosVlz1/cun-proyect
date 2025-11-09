# Sistema de Gestión de Tareas

Sistema completo de gestión de tareas Full Stack desarrollado con NestJS y Next.js, cumpliendo con los estándares de calidad ISO 25010.

## 📋 Descripción

Aplicación web moderna para la gestión eficiente de tareas, diseñada para maximizar la productividad. Incluye funcionalidades completas de CRUD, autenticación segura, estadísticas y más.

## ✨ Características Principales

- ✅ **Gestión Completa de Tareas**: Crear, editar, eliminar y organizar tareas
- 📊 **Estadísticas Avanzadas**: Visualiza tu productividad con métricas detalladas
- 🔐 **Autenticación Segura**: Sistema de autenticación con JWT y NextAuth
- 🎨 **Interfaz Moderna**: UI construida con Material-UI y diseño responsive
- 📱 **Responsive Design**: Funciona perfectamente en dispositivos móviles y desktop
- 🔍 **Búsqueda y Filtros**: Encuentra tareas rápidamente con filtros avanzados
- 🏷️ **Etiquetas y Prioridades**: Organiza tareas con etiquetas y niveles de prioridad
- 📈 **Dashboard Intuitivo**: Vista general de estadísticas y tareas recientes

## 🛠️ Stack Tecnológico

### Backend
- **NestJS** - Framework Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Passport** - Estrategias de autenticación
- **Swagger** - Documentación de API
- **Winston** - Logging
- **Helmet** - Seguridad HTTP

### Frontend
- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca UI
- **Material-UI (MUI)** - Componentes UI
- **NextAuth.js** - Autenticación
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **TypeScript** - Tipado estático

## 📁 Estructura del Proyecto

```
cun-project/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── modules/  # Módulos de la aplicación
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── users/
│   │   │   ├── statistics/
│   │   │   └── backup/
│   │   ├── config/   # Configuración
│   │   └── main.ts   # Punto de entrada
│   └── package.json
├── frontend/         # Aplicación Next.js
│   ├── src/
│   │   ├── app/      # Páginas y rutas
│   │   ├── components/
│   │   ├── services/
│   │   └── theme/
│   └── package.json
└── package.json      # Workspace root
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- MongoDB (local o Atlas)

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd cun-project
```

2. Instala las dependencias:
```bash
npm run install:all
```

3. Configura las variables de entorno:
   - Backend: Crea `.env` en `/backend` (ver `.env.example`)
   - Frontend: Crea `.env.local` en `/frontend`

4. Inicia el servidor de desarrollo:
```bash
# Backend
npm run dev:backend

# Frontend (en otra terminal)
npm run dev:frontend
```

5. Accede a la aplicación:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - Swagger Docs: http://localhost:4000/api/docs

## 📚 Documentación

- [Guía de Instalación](./INSTALLATION.md) - Instrucciones detalladas de instalación
- [Guía Rápida](./QUICK_START.md) - Inicio rápido
- [Arquitectura](./ARCHITECTURE.md) - Descripción de la arquitectura
- [Cumplimiento ISO 25010](./ISO25010_COMPLIANCE.md) - Estándares de calidad
- [Resumen del Proyecto](./PROJECT_SUMMARY.md) - Visión general

## 🔧 Scripts Disponibles

### Root
- `npm run install:all` - Instala dependencias de todos los workspaces
- `npm run dev` - Inicia con Docker Compose
- `npm run build` - Construye backend y frontend
- `npm run lint` - Ejecuta linters
- `npm run format` - Formatea código con Prettier

### Backend
- `npm run start:dev` - Modo desarrollo
- `npm run build` - Compila TypeScript
- `npm run start:prod` - Modo producción
- `npm run test` - Ejecuta tests

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Servidor de producción

## 🔐 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/tareas_db
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Frontend (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🐳 Docker

El proyecto incluye soporte para Docker:

```bash
# Iniciar con Docker Compose
docker-compose up

# O construir y ejecutar manualmente
docker build -t backend ./backend
docker build -t frontend ./frontend
```

## 🧪 Testing

```bash
# Backend
cd backend
npm run test
npm run test:cov

# Frontend
cd frontend
npm run test
```

## 📝 Licencia

MIT

## 👥 Contribuidores

Sistema desarrollado como parte de un proyecto académico cumpliendo con ISO 25010.

## 📞 Soporte

Para problemas o preguntas, por favor abre un issue en el repositorio.