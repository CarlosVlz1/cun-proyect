# 🚀 Desplegar Frontend y Backend Juntos

Guía para desplegar ambos servicios en un solo proyecto usando Railway o Render.

## ✅ Ventajas de Desplegar Juntos

- ✅ **Un solo proyecto** - Todo en un lugar
- ✅ **Variables compartidas** - Más fácil de gestionar
- ✅ **Deploy coordinado** - Ambos servicios se actualizan juntos
- ✅ **Menos configuración** - Una sola plataforma

---

## 🎯 Opción 1: Railway (Recomendada)

Railway permite tener múltiples servicios en un solo proyecto, perfecto para monorepos.

### Paso 1: Configurar MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta y cluster FREE
3. Configura usuario y contraseña
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Obtén connection string:
   ```
   mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
   ```

### Paso 2: Generar Secrets

```bash
./generar-secrets.sh
```

O manualmente:
```bash
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # NEXTAUTH_SECRET
```

### Paso 3: Crear Proyecto en Railway

1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Conecta tu repositorio

### Paso 4: Agregar Servicio Backend

1. En tu proyecto Railway, click "New" → "Service"
2. Selecciona "GitHub Repo" (el mismo repositorio)
3. En "Settings" → "Source":
   - **Root Directory**: `backend`
   - Railway detectará automáticamente que es Node.js

4. **Configurar Build**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

5. **Variables de Entorno** (Settings → Variables):
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
   JWT_SECRET=tu-jwt-secret-generado
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://tu-proyecto.railway.app
   THROTTLE_TTL=60
   THROTTLE_LIMIT=100
   ```

6. **Configurar Puerto**:
   - Settings → Networking
   - Railway asignará un puerto automáticamente
   - Generará una URL pública (ej: `https://backend-production-xxxx.up.railway.app`)

### Paso 5: Agregar Servicio Frontend

1. En el mismo proyecto Railway, click "New" → "Service"
2. Selecciona "GitHub Repo" (el mismo repositorio)
3. En "Settings" → "Source":
   - **Root Directory**: `frontend`

4. **Configurar Build**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Output Directory: `.next` (Next.js lo maneja automáticamente)

5. **Variables de Entorno**:
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://tu-frontend.railway.app
   NEXTAUTH_SECRET=tu-nextauth-secret-generado
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
   ```

6. **Configurar Puerto**:
   - Settings → Networking
   - Railway asignará un puerto automáticamente
   - Generará una URL pública

### Paso 6: Actualizar URLs

Una vez que ambos servicios estén desplegados:

1. **Backend** → Actualizar `FRONTEND_URL` con la URL del frontend
2. **Frontend** → Actualizar `NEXT_PUBLIC_API_URL` con la URL del backend + `/api`
3. **Frontend** → Actualizar `NEXTAUTH_URL` con su propia URL

Railway redeployará automáticamente cuando cambies las variables.

### Paso 7: Configurar Dominios (Opcional)

1. En cada servicio → Settings → Networking
2. Click "Generate Domain" o agrega un dominio personalizado
3. Railway te dará URLs como:
   - Frontend: `https://frontend-production-xxxx.up.railway.app`
   - Backend: `https://backend-production-xxxx.up.railway.app`

---

## 🎯 Opción 2: Render

Render también permite múltiples servicios en un proyecto.

### Paso 1: Crear Blueprint en Render

1. Ve a https://render.com
2. Login con GitHub
3. Crea un archivo `render.yaml` en la raíz del proyecto (ya existe)

### Paso 2: Configurar render.yaml

El archivo `render.yaml` ya está creado. Solo necesitas actualizar las variables de entorno en el dashboard de Render.

### Paso 3: Crear Servicios en Render

1. Ve a Dashboard → "New" → "Blueprint"
2. Conecta tu repositorio
3. Render detectará el `render.yaml` y creará los servicios automáticamente

4. **Configurar Variables de Entorno** en cada servicio:

   **Backend:**
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=...
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://tu-frontend.onrender.com
   THROTTLE_TTL=60
   THROTTLE_LIMIT=100
   ```

   **Frontend:**
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://tu-frontend.onrender.com
   NEXTAUTH_SECRET=...
   NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
   ```

### Paso 4: Actualizar URLs

Igual que en Railway, actualiza las URLs una vez desplegados ambos servicios.

**Nota**: En el plan gratuito de Render, los servicios se "duermen" después de 15 minutos de inactividad y tardan ~30 segundos en despertar.

---

## 📋 Checklist de Configuración

### Antes de Desplegar

- [ ] Código subido a GitHub
- [ ] MongoDB Atlas configurado
- [ ] Connection string de MongoDB listo
- [ ] Secrets generados (JWT_SECRET, NEXTAUTH_SECRET)
- [ ] Repositorio conectado a Railway/Render

### Variables Backend

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=... (mínimo 32 caracteres)
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend-url
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Variables Frontend

```env
NODE_ENV=production
NEXTAUTH_URL=https://tu-frontend-url
NEXTAUTH_SECRET=... (mínimo 32 caracteres)
NEXT_PUBLIC_API_URL=https://tu-backend-url/api
```

### Después del Primer Deploy

- [ ] Copiar URL del backend
- [ ] Copiar URL del frontend
- [ ] Actualizar `FRONTEND_URL` en backend
- [ ] Actualizar `NEXT_PUBLIC_API_URL` en frontend
- [ ] Actualizar `NEXTAUTH_URL` en frontend
- [ ] Verificar que ambos servicios se comuniquen

---

## 🔧 Configuraciones Adicionales

### Actualizar CORS en Backend

Asegúrate de que en `backend/src/main.ts` el CORS incluya la URL de producción:

```typescript
app.enableCors({
  origin: [
    frontendUrl,  // Viene de FRONTEND_URL
    'http://localhost:3000',  // Para desarrollo local
    'https://tu-frontend.railway.app'  // Tu URL de producción
  ],
  credentials: true,
  // ...
});
```

### Estructura del Proyecto en Railway

```
Proyecto Railway
├── Backend Service
│   ├── Root: backend/
│   ├── Build: npm install && npm run build
│   └── Start: npm run start:prod
└── Frontend Service
    ├── Root: frontend/
    ├── Build: npm install && npm run build
    └── Start: npm run start
```

---

## 🐛 Solución de Problemas

### El backend no conecta con MongoDB

1. Verifica la connection string
2. Verifica que la IP esté en whitelist (0.0.0.0/0 para desarrollo)
3. Verifica los logs en Railway/Render

### El frontend no conecta con el backend

1. Verifica `NEXT_PUBLIC_API_URL` (debe terminar en `/api`)
2. Verifica que el backend esté corriendo
3. Verifica CORS en el backend
4. Verifica que las URLs sean HTTPS

### Error 401/403 en autenticación

1. Verifica que los secrets tengan al menos 32 caracteres
2. Verifica que las URLs sean HTTPS
3. Verifica que `NEXTAUTH_URL` coincida con la URL real del frontend

### Build falla

1. Verifica los logs del build
2. Asegúrate de que todas las dependencias estén en `package.json`
3. Verifica que no haya errores de TypeScript
4. En Railway, verifica que el Root Directory esté correcto

### Los servicios no se comunican

1. Verifica que ambos servicios estén en el mismo proyecto (Railway)
2. Verifica que las URLs sean correctas
3. Verifica que el backend esté exponiendo el puerto correcto
4. Verifica que el frontend esté usando la URL correcta del backend

---

## 💰 Costos

### Railway

- **Plan Hobby**: $5 créditos/mes (suficiente para desarrollo)
- **Pay-as-you-go**: Solo pagas lo que usas
- **2 servicios**: ~$5-10/mes dependiendo del uso

### Render

- **Plan Free**: Gratis pero con limitaciones
  - Servicios se duermen después de 15 min
  - Tardan ~30 seg en despertar
- **Plan Starter**: $7/mes por servicio

---

## ✅ Verificación Final

Una vez desplegado, verifica:

1. **Frontend**: Debe cargar correctamente
2. **Backend API**: `https://tu-backend.railway.app/api`
3. **Swagger**: `https://tu-backend.railway.app/api/docs`
4. **Health Check**: `https://tu-backend.railway.app/api/health` (si existe)
5. **Login/Registro**: Debe funcionar correctamente
6. **Comunicación**: El frontend debe poder hacer requests al backend

---

## 📚 Recursos

- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Render](https://render.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)

---

## 🎉 ¡Listo!

Tu aplicación está desplegada con ambos servicios juntos. Ambos se actualizarán automáticamente cuando hagas push a GitHub.

