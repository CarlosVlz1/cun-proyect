# ⚙️ Configuración de Railway para Monorepo

Esta guía te ayuda a configurar correctamente Railway cuando tienes un monorepo con frontend y backend.

## 🔧 Configuración Correcta en Railway

### Para el Servicio Backend

1. **Crear el servicio**:
   - New → Service → GitHub Repo
   - Selecciona tu repositorio

2. **Configurar Root Directory**:
   - Settings → Source
   - **Root Directory**: `backend`
   - ⚠️ **IMPORTANTE**: Debe ser exactamente `backend` (sin barra al final)

3. **Build Command** (Settings → Build):
   - `npm install && npm run build`
   - O déjalo vacío y Railway usará el `railway.json` de `backend/`

4. **Start Command** (Settings → Deploy):
   - `npm run start:prod`
   - O déjalo vacío y Railway usará el `railway.json` de `backend/`

### Para el Servicio Frontend

1. **Crear el servicio**:
   - New → Service → GitHub Repo
   - Selecciona tu repositorio

2. **Configurar Root Directory**:
   - Settings → Source
   - **Root Directory**: `frontend`
   - ⚠️ **IMPORTANTE**: Debe ser exactamente `frontend` (sin barra al final)

3. **Build Command** (Settings → Build):
   - `npm install && npm run build`
   - O déjalo vacío y Railway usará el `railway.json` de `frontend/`

4. **Start Command** (Settings → Deploy):
   - `npm run start`
   - O déjalo vacío y Railway usará el `railway.json` de `frontend/`

## 📋 Checklist de Configuración

### Backend Service
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build` (o vacío para usar railway.json)
- [ ] Start Command: `npm run start:prod` (o vacío para usar railway.json)
- [ ] Variables de entorno configuradas

### Frontend Service
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build` (o vacío para usar railway.json)
- [ ] Start Command: `npm run start` (o vacío para usar railway.json)
- [ ] Variables de entorno configuradas

## 🐛 Solución de Problemas

### Error: "Missing script: start:prod"

**Causa**: Railway está ejecutando desde el directorio raíz en lugar de `backend/`

**Solución**:
1. Verifica que el **Root Directory** esté configurado como `backend` (no `/backend` ni `./backend`)
2. Verifica que no haya espacios antes o después
3. Si el problema persiste, agrega el Start Command manualmente: `npm run start:prod`

### Error: "Cannot find module"

**Causa**: Las dependencias no se instalaron correctamente

**Solución**:
1. Verifica que el Build Command incluya `npm install`
2. Revisa los logs del build para ver si hay errores de instalación
3. Asegúrate de que el Root Directory sea correcto

### El servicio no inicia

**Causa**: El Start Command no es correcto o el build falló

**Solución**:
1. Verifica los logs del build
2. Verifica que el Start Command sea correcto para el servicio
3. Backend: `npm run start:prod`
4. Frontend: `npm run start`

## 📝 Archivos de Configuración

Se han creado archivos `railway.json` en cada carpeta:

- `backend/railway.json` - Configuración específica del backend
- `frontend/railway.json` - Configuración específica del frontend

Railway detectará automáticamente estos archivos si el Root Directory está configurado correctamente.

## ✅ Verificación

Después de configurar:

1. **Backend debe**:
   - Compilar correctamente (`npm run build`)
   - Iniciar con `npm run start:prod`
   - Estar accesible en la URL de Railway

2. **Frontend debe**:
   - Compilar correctamente (`npm run build`)
   - Iniciar con `npm run start`
   - Estar accesible en la URL de Railway

## 🔄 Si el Problema Persiste

Si después de configurar el Root Directory correctamente aún tienes problemas:

1. **Elimina y recrea el servicio** en Railway
2. **Configura manualmente** los comandos en Settings
3. **Verifica los logs** para ver exactamente qué está ejecutando Railway

