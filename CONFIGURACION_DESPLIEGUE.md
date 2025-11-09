# ⚙️ Configuración Necesaria para Despliegue

Esta guía te explica qué necesitas tener configurado antes de desplegar.

## 📋 Checklist Pre-Despliegue

### 1. Repositorio en GitHub ✅

- [ ] Código subido a GitHub
- [ ] Repositorio público o con acceso para Railway/Render
- [ ] Últimos cambios commiteados y pusheados

### 2. MongoDB Atlas ✅

- [ ] Cuenta creada en https://www.mongodb.com/cloud/atlas
- [ ] Cluster FREE creado
- [ ] Usuario de base de datos creado (guarda username y password)
- [ ] Network Access configurado (0.0.0.0/0 para permitir desde cualquier IP)
- [ ] Connection string copiado y modificado:
  ```
  mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
  ```

### 3. Secrets Generados ✅

Necesitas generar dos secrets seguros:

```bash
# Opción 1: Usar el script
./generar-secrets.sh

# Opción 2: Manualmente
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para NEXTAUTH_SECRET
```

**⚠️ IMPORTANTE**: Guarda estos valores de forma segura. Los necesitarás para configurar las variables de entorno.

### 4. Variables de Entorno Preparadas ✅

Prepara estas variables antes de desplegar:

#### Backend

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
JWT_SECRET=tu-secret-generado-con-openssl-rand-base64-32
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend-url (se actualizará después)
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### Frontend

```env
NODE_ENV=production
NEXTAUTH_URL=https://tu-frontend-url (se actualizará después)
NEXTAUTH_SECRET=tu-secret-generado-con-openssl-rand-base64-32
NEXT_PUBLIC_API_URL=https://tu-backend-url/api (se actualizará después)
```

### 5. Archivos de Configuración ✅

Los siguientes archivos ya están creados y configurados:

- ✅ `render.yaml` - Configuración para Render
- ✅ `railway.json` - Configuración para Railway
- ✅ `vercel.json` - Configuración para Vercel (si usas Vercel solo para frontend)

### 6. Estructura del Proyecto ✅

Tu proyecto tiene la estructura correcta:

```
cun-proyect/
├── backend/          # Servicio backend
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         # Servicio frontend
│   ├── src/
│   ├── package.json
│   └── ...
└── package.json      # Workspace root
```

---

## 🔧 Configuraciones Específicas por Plataforma

### Railway

**Qué necesitas:**
- [ ] Cuenta en Railway (https://railway.app)
- [ ] Conectado con GitHub
- [ ] Permisos para acceder al repositorio

**Configuración automática:**
- Railway detecta automáticamente Node.js
- Detecta `package.json` en cada carpeta
- Asigna puertos automáticamente

**Qué configurar manualmente:**
- Root Directory para cada servicio (`backend` y `frontend`)
- Variables de entorno
- Build y Start commands (opcional, Railway los detecta)

### Render

**Qué necesitas:**
- [ ] Cuenta en Render (https://render.com)
- [ ] Conectado con GitHub
- [ ] Archivo `render.yaml` en la raíz (ya existe)

**Configuración automática:**
- Render lee `render.yaml` y crea los servicios automáticamente
- Configura build y start commands desde el archivo

**Qué configurar manualmente:**
- Variables de entorno (puedes hacerlo desde el dashboard o en `render.yaml`)

---

## 📝 Orden de Configuración Recomendado

### Paso 1: MongoDB Atlas (5 minutos)
1. Crear cuenta
2. Crear cluster
3. Configurar usuario
4. Obtener connection string

### Paso 2: Generar Secrets (1 minuto)
```bash
./generar-secrets.sh
```

### Paso 3: Crear Proyecto en Railway/Render (2 minutos)
1. Login con GitHub
2. Crear nuevo proyecto
3. Conectar repositorio

### Paso 4: Configurar Backend (5 minutos)
1. Crear servicio backend
2. Configurar Root Directory: `backend`
3. Agregar variables de entorno
4. Deploy

### Paso 5: Configurar Frontend (5 minutos)
1. Crear servicio frontend
2. Configurar Root Directory: `frontend`
3. Agregar variables de entorno (con URLs temporales)
4. Deploy

### Paso 6: Actualizar URLs (2 minutos)
1. Copiar URL del backend
2. Copiar URL del frontend
3. Actualizar variables en ambos servicios
4. Redeploy automático

**Total: ~20 minutos**

---

## ⚠️ Errores Comunes y Cómo Evitarlos

### Error: "Cannot find module"

**Causa**: Root Directory no está configurado correctamente.

**Solución**: 
- Railway: Settings → Source → Root Directory = `backend` o `frontend`
- Render: Verifica `rootDir` en `render.yaml`

### Error: "MongoDB connection failed"

**Causa**: Connection string incorrecto o IP no en whitelist.

**Solución**:
- Verifica que el connection string incluya `/tareas_db`
- Verifica que Network Access en MongoDB Atlas permita 0.0.0.0/0

### Error: "JWT_SECRET must be at least 32 characters"

**Causa**: Secret muy corto.

**Solución**: Genera uno nuevo con `openssl rand -base64 32`

### Error: "CORS policy blocked"

**Causa**: `FRONTEND_URL` no coincide con la URL real.

**Solución**: Actualiza `FRONTEND_URL` en el backend con la URL exacta del frontend.

### Error: "Build failed"

**Causa**: Dependencias faltantes o errores de TypeScript.

**Solución**:
- Verifica que `package.json` tenga todas las dependencias
- Ejecuta `npm run build` localmente para verificar
- Revisa los logs del build en Railway/Render

---

## 🔐 Seguridad

### Variables Sensibles

**NUNCA** commitees estos archivos:
- `.env`
- `.env.local`
- `.env.production`
- Cualquier archivo con secrets

**Siempre** usa variables de entorno en la plataforma de hosting.

### Secrets

- Genera secrets únicos para producción
- No reutilices secrets de desarrollo
- Guarda los secrets de forma segura (password manager)

### MongoDB

- Usa contraseñas fuertes
- Limita Network Access cuando sea posible
- No compartas connection strings públicamente

---

## ✅ Verificación Post-Despliegue

Después de desplegar, verifica:

1. **Backend responde**:
   ```bash
   curl https://tu-backend.railway.app/api
   ```

2. **Frontend carga**:
   - Visita la URL del frontend
   - Debe cargar sin errores

3. **Comunicación**:
   - Intenta hacer login/registro
   - Verifica que las requests lleguen al backend

4. **Logs**:
   - Revisa los logs en Railway/Render
   - No debe haber errores críticos

---

## 📚 Siguiente Paso

Una vez que tengas todo configurado, sigue la guía en:
- [DESPLIEGUE_JUNTO.md](./DESPLIEGUE_JUNTO.md) - Para desplegar ambos servicios juntos
- [DESPLIEGUE_WEB.md](./DESPLIEGUE_WEB.md) - Para opciones de despliegue separado

