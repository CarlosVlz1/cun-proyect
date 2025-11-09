# ⚡ Despliegue Rápido en la Web

Guía rápida para desplegar en menos de 30 minutos.

## 🎯 Opción Más Fácil (Recomendada)

### Stack: Vercel + Railway + MongoDB Atlas

**Tiempo estimado**: 20-30 minutos  
**Costo**: $0/mes (gratis para empezar)

---

## 📋 Pasos Rápidos

### 1️⃣ MongoDB Atlas (5 min)

1. Ve a https://www.mongodb.com/cloud/atlas → Crear cuenta
2. Crear cluster FREE
3. Database Access → Crear usuario (guarda password)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Database → Connect → Copiar connection string
6. Reemplazar `<password>` y agregar `/tareas_db` al final

**Connection string final:**
```
mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
```

### 2️⃣ Generar Secrets (1 min)

```bash
# Generar JWT_SECRET
openssl rand -base64 32

# Generar NEXTAUTH_SECRET  
openssl rand -base64 32
```

Guarda estos valores, los necesitarás.

### 3️⃣ Desplegar Backend en Railway (10 min)

1. Ve a https://railway.app → Login con GitHub
2. New Project → Deploy from GitHub repo
3. Selecciona tu repositorio
4. Agrega servicio → Selecciona carpeta `backend`
5. Variables → Agregar:

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/tareas_db?retryWrites=true&w=majority
JWT_SECRET=tu-secret-generado-anteriormente
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-app.vercel.app
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

6. Settings → Build Command: `npm run build`
7. Settings → Start Command: `npm run start:prod`
8. Copiar la URL del backend (ej: `https://tu-backend.railway.app`)

### 4️⃣ Desplegar Frontend en Vercel (10 min)

1. Ve a https://vercel.com → Login con GitHub
2. Add New Project → Importar repositorio
3. Configuración:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detectado)
4. Environment Variables:

```env
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu-secret-generado-anteriormente
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
```

5. Deploy
6. Copiar la URL del frontend (ej: `https://tu-app.vercel.app`)

### 5️⃣ Actualizar URLs (2 min)

**En Railway:**
- Actualizar `FRONTEND_URL` con la URL de Vercel

**En Vercel:**
- Actualizar `NEXTAUTH_URL` con la URL correcta
- Actualizar `NEXT_PUBLIC_API_URL` si es necesario

Ambos se redeployarán automáticamente.

---

## ✅ Verificar

- Frontend: `https://tu-app.vercel.app`
- Backend API: `https://tu-backend.railway.app/api`
- Swagger: `https://tu-backend.railway.app/api/docs`

---

## 🆘 Problemas Comunes

**Backend no conecta a MongoDB:**
- Verifica la connection string
- Verifica que la IP esté en whitelist (0.0.0.0/0)

**Frontend no conecta al backend:**
- Verifica `NEXT_PUBLIC_API_URL`
- Verifica CORS en el backend (debe incluir la URL de Vercel)

**Error 401/403:**
- Verifica que los secrets tengan al menos 32 caracteres
- Verifica que las URLs sean HTTPS

---

## 📚 Documentación Completa

Para más detalles, ver [DESPLIEGUE_WEB.md](./DESPLIEGUE_WEB.md)

