# 🔧 Solución Error 502 en Railway

## Problema

Error 502 Bad Gateway en Railway generalmente significa que:
- El servicio no está escuchando en el puerto correcto
- Railway asigna puertos dinámicos, pero Next.js por defecto usa el puerto 3000
- El servicio no está iniciando correctamente

## Solución Aplicada

Se han creado los siguientes archivos y configuraciones:

### 1. `frontend/server.js`
Script personalizado que:
- Lee el puerto de la variable de entorno `PORT` (asignado por Railway)
- Inicia Next.js escuchando en `0.0.0.0` (necesario para Railway)
- Usa el puerto dinámico que Railway asigna

### 2. `frontend/railway.json` (actualizado)
- Start Command cambiado a: `node server.js`
- Esto asegura que se use el script personalizado

### 3. `frontend/package.json` (actualizado)
- Scripts `start` y `start:prod` actualizados para usar la variable PORT

## Pasos para Aplicar la Solución

### Opción 1: Usar el script personalizado (Recomendado)

1. **Haz commit y push de los cambios**:
```bash
git add frontend/server.js frontend/railway.json frontend/package.json
git commit -m "fix: configure Next.js to use Railway dynamic port"
git push
```

2. **Railway redeployará automáticamente**

3. **Verifica que el Start Command en Railway sea**:
   - `node server.js`
   - O déjalo vacío para que use `railway.json`

### Opción 2: Configurar manualmente en Railway

Si prefieres no usar el script personalizado:

1. Ve a tu servicio Frontend en Railway
2. Settings → Deploy
3. Start Command: `next start -p $PORT`
4. Guarda los cambios

## Verificación

Después del deploy:

1. **Revisa los logs** en Railway:
   - Debe aparecer: `> Ready on http://0.0.0.0:XXXX`
   - Donde XXXX es el puerto asignado por Railway

2. **Verifica la URL**:
   - Debe responder correctamente (no 502)
   - Debe cargar la aplicación

## Variables de Entorno Necesarias

Asegúrate de tener estas variables configuradas en Railway:

```env
NODE_ENV=production
NEXTAUTH_URL=https://tareas-frontend-production.up.railway.app
NEXTAUTH_SECRET=tu-secret-generado
NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app/api
PORT=3000  # Railway lo asigna automáticamente, no necesitas configurarlo
```

## Si el Problema Persiste

### 1. Revisa los Logs
- Ve a Railway → Tu servicio → Logs
- Busca errores de inicio
- Verifica que el puerto sea el correcto

### 2. Verifica el Root Directory
- Settings → Source
- Root Directory debe ser: `frontend` (sin `/`)

### 3. Verifica el Build
- Asegúrate de que el build se complete exitosamente
- Revisa los logs del build

### 4. Verifica Variables de Entorno
- Todas las variables deben estar configuradas
- Especialmente `NEXTAUTH_URL` y `NEXT_PUBLIC_API_URL`

## Comandos Útiles para Debugging

```bash
# Ver logs en Railway
# Ve a Railway → Tu servicio → Logs

# Verificar que el puerto esté configurado
echo $PORT

# Verificar que Next.js esté instalado
npm list next
```

## Notas Importantes

- Railway asigna el puerto automáticamente, no necesitas configurarlo manualmente
- El script `server.js` lee el puerto de `process.env.PORT`
- Next.js debe escuchar en `0.0.0.0` (no `localhost`) para funcionar en Railway
- El build debe completarse antes de que el servicio inicie

