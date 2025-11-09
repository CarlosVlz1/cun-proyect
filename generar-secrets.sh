#!/bin/bash

# Script para generar secrets seguros para el despliegue

echo "🔐 Generando secrets para el despliegue..."
echo ""

# Generar JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo ""

echo "✅ Secrets generados exitosamente!"
echo ""
echo "📋 Copia estos valores y úsalos en:"
echo "   - Railway (Backend): JWT_SECRET"
echo "   - Vercel (Frontend): NEXTAUTH_SECRET"
echo ""
echo "⚠️  IMPORTANTE: Guarda estos valores de forma segura."

