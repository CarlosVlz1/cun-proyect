#!/bin/bash
# Script para resolver problemas de permisos EACCES

echo "🔧 Resolviendo problemas de permisos..."

# Resolver permisos del cache de npm
echo "1. Corrigiendo permisos del cache de npm..."
sudo chown -R 502:80 "/Users/cvelez/.npm" 2>/dev/null || echo "⚠️  Requiere sudo para cambiar permisos de .npm"

# Resolver permisos de node_modules
echo "2. Corrigiendo permisos de node_modules..."
sudo chown -R 502:80 "/Users/cvelez/Downloads/GitHub/cun-proyect/node_modules" 2>/dev/null || echo "⚠️  Requiere sudo para cambiar permisos de node_modules"

# Limpiar cache de npm
echo "3. Limpiando cache de npm..."
npm cache clean --force 2>/dev/null || echo "⚠️  Error al limpiar cache"

# Verificar espacio en disco
echo "4. Verificando espacio en disco..."
df -h / | tail -1

echo ""
echo "✅ Proceso completado"
echo ""
echo "Próximos pasos:"
echo "1. Liberar espacio en disco si es necesario"
echo "2. cd frontend && npm install --legacy-peer-deps"
echo "3. npm test"

