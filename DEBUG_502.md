# 🔍 Debug Error 502 en Railway

## Checklist de Verificación

Sigue estos pasos para diagnosticar el problema:

### 1. Verificar Logs en Railway

1. Ve a Railway → Tu servicio Frontend
2. Click en "Logs" o "View Logs"
3. Busca estos mensajes:

**✅ Logs esperados (si funciona):**
```
[Server] Initializing Next.js...
[Server] Port: XXXX
[Server] Next.js app prepared successfully
[Server] ✅ Ready on http://0.0.0.0:XXXX
```

**❌ Logs de error comunes:**
- `Failed to prepare Next.js app` → Problema con el build
- `EADDRINUSE` → Puerto ya en uso
- `Cannot find module` → Dependencias faltantes
- `Build failed` → Error en el build

### 2. Verificar Configuración en Railway

#### Root Directory
- Settings → Source → Root Directory
- Debe ser exactamente: `frontend` (sin `/` al inicio o final)

#### Build Command
- Settings → Build → Build Command
- Debe ser: `npm install && npm run build`
- O déjalo vacío para usar `railway.json`

#### Start Command
- Settings → Deploy → Start Command
- Debe ser: `node server.js`
- O déjalo vacío para usar `railway.json`

### 3. Verificar Variables de Entorno

Settings → Variables → Debe tener:

```env
NODE_ENV=production
NEXTAUTH_URL=https://tareas-frontend-production.up.railway.app
NEXTAUTH_SECRET=tu-secret-generado
NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app/api
```

**⚠️ IMPORTANTE:**
- `PORT` NO debe estar configurado manualmente (Railway lo asigna)
- `NEXTAUTH_URL` debe coincidir con la URL real de Railway
- `NEXT_PUBLIC_API_URL` debe apuntar a tu backend

### 4. Verificar que el Build se Complete

En los logs del build, busca:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

Si el build falla, el servicio no iniciará.

### 5. Alternativa: Usar `next start` Directamente

Si el servidor personalizado no funciona, prueba esto:

1. En Railway → Settings → Deploy → Start Command
2. Cambia a: `next start -p $PORT -H 0.0.0.0`
3. Guarda y redeploya

### 6. Verificar que el Archivo server.js Exista

1. Verifica que `frontend/server.js` esté en el repositorio
2. Verifica que esté commiteado y pusheado
3. Railway debe poder ver el archivo

## Soluciones Alternativas

### Opción A: Usar next start directamente

```bash
# En Railway → Settings → Deploy → Start Command
next start -p $PORT -H 0.0.0.0
```

### Opción B: Verificar el build localmente

```bash
cd frontend
npm install
npm run build
npm run start
```

Si funciona localmente pero no en Railway, el problema es de configuración.

### Opción C: Recrear el servicio

1. Elimina el servicio Frontend en Railway
2. Crea un nuevo servicio
3. Configura todo desde cero
4. Asegúrate de que Root Directory sea `frontend`

## Preguntas para Diagnosticar

1. **¿Qué aparece en los logs?**
   - Copia los últimos 50-100 líneas de los logs

2. **¿El build se completa exitosamente?**
   - Revisa los logs del build

3. **¿El servicio muestra "Running" o "Crashed"?**
   - Ve al dashboard del servicio

4. **¿Cuándo empezó el error 502?**
   - ¿Después del último deploy?
   - ¿Desde el principio?

## Comandos para Probar Localmente

```bash
# Simular Railway localmente
cd frontend
PORT=3000 NODE_ENV=production node server.js

# O con next start
PORT=3000 NODE_ENV=production next start -p 3000 -H 0.0.0.0
```

## Contacto

Si después de seguir estos pasos el problema persiste, comparte:
1. Los últimos 100 líneas de los logs
2. La configuración de Railway (sin secrets)
3. El resultado del build

