# Arquitectura del Sistema

## Visión General

El sistema está construido siguiendo una arquitectura **Full Stack** moderna con separación clara entre frontend y backend, utilizando un enfoque de **monorepo** para facilitar el desarrollo y mantenimiento.

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Pages  │  │Components│  │ Services│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       │              │              │                   │
│       └──────────────┼──────────────┘                   │
│                      │ HTTP/REST / WebSocket             │
└──────────────────────┼──────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────┐
│                    Backend (NestJS)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Controllers│ │ Services │  │  Schemas │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       │              │              │                   │
│       └──────────────┼──────────────┘                   │
│                      │                                  │
│         ┌────────────┴────────────┐                     │
│         │                         │                     │
│    ┌────▼────┐              ┌────▼────┐               │
│    │Publishers│              │Subscribers│             │
│    │(Events) │              │(Handlers)│             │
│    └────┬────┘              └────┬────┘               │
│         │                        │                     │
│         └────────────┬───────────┘                     │
│                      │ Pub/Sub Protocol                 │
│                      │                                  │
│                      │ Mongoose ODM                     │
└──────────────────────┼──────────────────────────────────┘
                   │ │
         ┌─────────┘ └─────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│Message Broker   │   │   MongoDB       │
│  (Redis)        │   │                 │
│  - Pub/Sub      │   │  - Persistence  │
│  - Events       │   │  - Data Store   │
└─────────────────┘   └─────────────────┘
```

### Patrón Pub/Sub (Publicación/Suscripción)

El sistema implementa un patrón **Pub/Sub** para comunicación asíncrona y desacoplada entre componentes:

#### Componentes

1. **Publishers (Publicadores)**
   - Los Services publican eventos cuando ocurren acciones importantes
   - Ejemplos: `task.created`, `task.updated`, `user.registered`
   - Desacopla la lógica de negocio de las acciones reactivas

2. **Message Broker (Redis)**
   - Actúa como intermediario entre publishers y subscribers
   - Garantiza la entrega de mensajes
   - Permite múltiples subscribers para el mismo evento
   - Soporta patrones de cola y pub/sub

3. **Subscribers (Suscriptores)**
   - Escuchan eventos específicos del Message Broker
   - Ejecutan handlers cuando reciben eventos
   - Ejemplos: notificaciones, actualización de caché, logging, webhooks

#### Flujo de Eventos

```
1. Service → Ejecuta acción de negocio
2. Service → Publica evento al Message Broker
3. Message Broker → Distribuye evento a todos los subscribers
4. Subscribers → Ejecutan handlers (notificaciones, caché, etc.)
5. Frontend → Recibe actualizaciones vía WebSocket (opcional)
```

#### Casos de Uso

- **Notificaciones en tiempo real**: Cuando se crea una tarea, notificar a otros usuarios
- **Invalidación de caché**: Actualizar caché cuando cambian datos
- **Logging y auditoría**: Registrar eventos importantes
- **Integraciones externas**: Enviar webhooks a servicios externos
- **Cálculo de estadísticas**: Actualizar métricas cuando cambian datos

## Backend Architecture

### Patrón Modular

El backend sigue la arquitectura modular de NestJS:

```
backend/
├── src/
│   ├── main.ts                    # Bootstrap de la aplicación
│   ├── app.module.ts              # Módulo raíz
│   ├── config/                    # Configuración global
│   │   ├── configuration.ts      # Variables de entorno
│   │   ├── validation.schema.ts  # Validación Joi
│   │   └── winston.config.ts     # Logging
│   └── modules/                  # Módulos de negocio
│       ├── auth/                 # Autenticación
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/       # Passport strategies
│       │   └── guards/           # Guards de autenticación
│       ├── tasks/                # Gestión de tareas
│       │   ├── tasks.controller.ts
│       │   ├── tasks.service.ts
│       │   ├── schemas/          # Mongoose schemas
│       │   └── dto/              # Data Transfer Objects
│       ├── users/                 # Usuarios
│       ├── statistics/            # Estadísticas
│       └── backup/                # Respaldo de datos
```

### Principios de Diseño

1. **Separación de Responsabilidades**
   - Controllers: Manejan HTTP requests/responses
   - Services: Lógica de negocio
   - Schemas: Modelos de datos

2. **Inyección de Dependencias**
   - NestJS utiliza DI para desacoplar componentes

3. **Validación de Datos**
   - DTOs con class-validator
   - Validación automática con ValidationPipe

4. **Seguridad**
   - JWT para autenticación
   - Helmet para headers HTTP seguros
   - Throttling para prevenir ataques

## Frontend Architecture

### App Router (Next.js 14)

```
frontend/
├── src/
│   ├── app/                      # App Router
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Página de login
│   │   ├── register/             # Página de registro
│   │   ├── dashboard/            # Dashboard
│   │   ├── tasks/                # Gestión de tareas
│   │   ├── statistics/           # Estadísticas
│   │   └── profile/              # Perfil de usuario
│   ├── components/                # Componentes reutilizables
│   │   ├── Navigation.tsx        # Barra de navegación
│   │   ├── DashboardLayout.tsx  # Layout autenticado
│   │   ├── CreateTaskDialog.tsx # Modal de creación
│   │   └── Footer.tsx            # Pie de página
│   ├── services/                 # Servicios API
│   │   └── api/
│   │       ├── tasks.service.ts
│   │       └── auth.service.ts
│   ├── theme/                    # Tema MUI
│   └── types/                    # TypeScript types
```

### Principios de Diseño Frontend

1. **Component-Based Architecture**
   - Componentes React reutilizables
   - Separación de lógica y presentación

2. **Server State Management**
   - React Query para caché y sincronización
   - Mutaciones optimistas

3. **Client State**
   - useState para estado local
   - Context API para estado global mínimo

4. **Type Safety**
   - TypeScript en todo el código
   - Tipos compartidos entre frontend y backend

## Flujo de Datos

### Autenticación

```
1. Usuario → Login Page
2. Frontend → POST /api/auth/login
3. Backend → Valida credenciales
4. Backend → Genera JWT
5. Frontend → Almacena token
6. Frontend → Redirige a Dashboard
```

### Gestión de Tareas

```
1. Usuario → Interactúa con UI
2. Frontend → React Query Mutation
3. Frontend → Axios → POST/PUT/DELETE /api/tasks
4. Backend → Valida request (Guards + DTOs)
5. Backend → Service → Lógica de negocio
6. Backend → Mongoose → MongoDB
7. Backend → Response JSON
8. Frontend → React Query → Actualiza caché
9. Frontend → UI se actualiza automáticamente
```

## Base de Datos

### Schema Principal

```javascript
User {
  username: String
  email: String
  password: String (hashed)
  fullName: String
  active: Boolean
}

Task {
  title: String
  description: String
  status: Enum [PENDING, IN_PROGRESS, COMPLETED]
  priority: Enum [LOW, MEDIUM, HIGH]
  dueDate: Date
  tags: [String]
  user: ObjectId → User
  archived: Boolean
}
```

## Seguridad

### Backend

- **Helmet**: Headers HTTP seguros
- **CORS**: Configurado para permitir solo frontend autorizado
- **JWT**: Tokens firmados con expiración
- **bcrypt**: Hash de contraseñas
- **Throttling**: Rate limiting
- **Validation**: Validación estricta de inputs

### Frontend

- **NextAuth**: Manejo seguro de sesiones
- **HTTPS**: En producción
- **CSP**: Content Security Policy
- **XSS Protection**: Sanitización de inputs

## Escalabilidad

### Backend

- Modularidad permite agregar nuevos features fácilmente
- Servicios independientes y testeables
- Preparado para horizontal scaling

### Frontend

- Code splitting automático con Next.js
- Lazy loading de componentes
- Optimización de imágenes y assets

## Deployment

### Arquitectura de Producción

```
┌─────────────────┐
│  CDN/Vercel     │  ← Frontend (Next.js)
└─────────────────┘
         │
         │ HTTPS
         │
┌─────────────────┐
│   Load Balancer │
└─────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│ API 1 │ │ API 2 │  ← Backend (NestJS)
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
    ┌────▼────┐
    │ MongoDB │  ← Database (Atlas)
    │  Atlas  │
    └─────────┘
```

## Mejores Prácticas Implementadas

1. ✅ **SOLID Principles**
2. ✅ **DRY (Don't Repeat Yourself)**
3. ✅ **Separation of Concerns**
4. ✅ **Type Safety**
5. ✅ **Error Handling**
6. ✅ **Logging**
7. ✅ **Documentation (Swagger)**
8. ✅ **Testing Ready**
