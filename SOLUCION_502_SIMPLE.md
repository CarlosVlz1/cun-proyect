# ✅ Solución Simple para Error 502

## Cambio Aplicado

He actualizado `frontend/railway.json` para usar `next start` directamente en lugar del servidor personalizado. Esto es más confiable.

## Pasos Inmediatos

### 1. Hacer Commit y Push

```bash
git add frontend/railway.json frontend/server.js
git commit -m "fix: use next start directly for Railway deployment"
git push
```

### 2. Verificar en Railway

**Opción A: Usar railway.json (Automático)**
- Railway leerá automáticamente el `railway.json`
- El Start Command será: `next start -p $PORT -H 0.0.0.0`

**Opción B: Configurar Manualmente**
1. Ve a Railway → Tu servicio Frontend
2. Settings → Deploy → Start Command
3. Cambia a: `next start -p $PORT -H 0.0.0.0`
4. Guarda

### 3. Verificar Variables de Entorno

Asegúrate de tener estas variables (Settings → Variables):

```env
NODE_ENV=production
NEXTAUTH_URL=https://tareas-frontend-production.up.railway.app
NEXTAUTH_SECRET=tu-secret-generado
NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app/api
```

**⚠️ NO configures PORT manualmente** - Railway lo asigna automáticamente.

### 4. Verificar Root Directory

1. Settings → Source → Root Directory
2. Debe ser exactamente: `frontend` (sin `/`)

### 5. Esperar el Redeploy

Railway redeployará automáticamente. Revisa los logs para ver:
```
> Ready on http://0.0.0.0:XXXX
```

## Si Aún Hay 502

### Revisa los Logs

1. Ve a Railway → Tu servicio → Logs
2. Busca errores en rojo
3. Copia los últimos 50-100 líneas

### Errores Comunes

**"Cannot find module 'next'"**
- El build no se completó
- Verifica los logs del build

**"EADDRINUSE"**
- Puerto ya en uso (raro en Railway)
- Railway debería manejar esto automáticamente

**"Build failed"**
- Hay errores en el código
- Revisa los logs del build

**"Missing environment variables"**
- Faltan variables de entorno
- Verifica Settings → Variables

## Verificación Final

Después del deploy, deberías ver en los logs:
```
> Ready on http://0.0.0.0:XXXX
```

Y la URL debe cargar sin error 502.

## Si Nada Funciona

1. **Elimina y recrea el servicio** en Railway
2. **Configura todo desde cero**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `next start -p $PORT -H 0.0.0.0`
3. **Agrega todas las variables de entorno**

